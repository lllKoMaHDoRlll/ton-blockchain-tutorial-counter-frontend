import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useMainContract } from './hooks/useMainContract'
import { useTonConnect } from './hooks/useTonConnect';

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawal
  } = useMainContract();

  const { connected } = useTonConnect();

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className="Card">
          <b>Our Contract Address</b>
          <div className="Hint">
            {contract_address?.slice(0, 30) + "..."}
          </div>
          <b>Our Contract Balance</b>
          <div className="Hint">
            {!contract_balance &&  "Loading..." }
            {contract_balance && (
              (contract_balance / 1000000000).toString() + " TON"
            )}
          </div>
          <b>Contract owner</b>
          <div>
            {owner_address?.toString() ?? "Loading..."}
          </div>
          <b>Recent sender</b>
          <div>
            {recent_sender?.toString() ?? "Loading..."}
          </div>
        </div>
        <div className="Card">
          <b>Counter Value</b>
          <div>
            {counter_value ?? "Loading..."}
          </div>
        </div>
      </div>
      <div>
        {connected && (
          <>
            <div>
              <a onClick={() => {
                sendIncrement();
              }}>
                Increment
              </a>
            </div>
            <div>
              <a onClick={() => {
                sendDeposit();
              }}>
                Deposit
              </a>
            </div>
            <div>
              <a onClick={() => {
                sendWithdrawal();
              }}>
                Withdrawal
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
