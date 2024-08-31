import { Address, OpenedContract, toNano } from "ton-core";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { MainContract } from "../contracts/MainContract";
import { useEffect, useState } from "react";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
    const { sender } = useTonConnect();

    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    const client = useTonClient();
    const [contractData, setContractData] = useState<null | {
        counter_value: number;
        recent_sender: Address;
        owner_address: Address;
        contract_balance: number;
    }>();

    const mainContract = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new MainContract(Address.parse("EQBwYji2MLP888Rf8CsnM5OdvKPZSQvhpwSYz-u3tu4O-G6C"));
        return client.open(contract) as OpenedContract<MainContract>;
    }, [client]);

    useEffect(() => {
        async function getValue() {
            if (!mainContract) return;
            
            const val = await mainContract.getData();
            const contractBalance = (await mainContract.getContractBalance()).balance;
            setContractData({
                counter_value: val.number,
                recent_sender: val.recent_sender,
                owner_address: val.owner_address,
                contract_balance: contractBalance
            });

            await sleep(5000);
            getValue();
        }

        getValue();
    }, [mainContract]);

    return {
        contract_address: mainContract?.address.toString(),
        ...contractData,
        sendIncrement: () => {
            return mainContract?.sendIncrement(sender, toNano("0.05"), 3);
        },
        sendDeposit: () => {
            return mainContract?.sendDeposit(sender, toNano("1"));
        },
        sendWithdrawal: () => {
            return mainContract?.sendWithdrawalRequest(sender, toNano("0.05"), toNano("1"));
        }
    };
}