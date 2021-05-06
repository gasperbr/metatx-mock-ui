export const stopLimitOrder = [{ "inputs": [{ "internalType": "uint256", "name": "_externalOrderFee", "type": "uint256" }, { "internalType": "contract IBentoBoxV1", "name": "_bentoBox", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "feeTo", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "LogFeesCollected", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "maker", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "digest", "type": "bytes32" }, { "indexed": false, "internalType": "contract ILimitOrderReceiver", "name": "receiver", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "fillAmount", "type": "uint256" }], "name": "LogFillOrder", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "digest", "type": "bytes32" }], "name": "LogOrderCancelled", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "feeTo", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "externalOrderFee", "type": "uint256" }], "name": "LogSetFees", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "contract ILimitOrderReceiver", "name": "receiver", "type": "address" }], "name": "LogWhiteListReceiver", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "FEE_DIVISOR", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes[]", "name": "calls", "type": "bytes[]" }, { "internalType": "bool", "name": "revertOnFail", "type": "bool" }], "name": "batch", "outputs": [{ "internalType": "bool[]", "name": "successes", "type": "bool[]" }, { "internalType": "bytes[]", "name": "results", "type": "bytes[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "maker", "type": "address" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "startTime", "type": "uint256" }, { "internalType": "uint256", "name": "endTime", "type": "uint256" }, { "internalType": "uint256", "name": "stopPrice", "type": "uint256" }, { "internalType": "contract IOracle", "name": "oracleAddress", "type": "address" }, { "internalType": "bytes", "name": "oracleData", "type": "bytes" }, { "internalType": "uint256", "name": "amountToFill", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "internalType": "struct StopLimitOrder.OrderArgs[]", "name": "order", "type": "tuple[]" }, { "internalType": "contract IERC20", "name": "tokenIn", "type": "address" }, { "internalType": "contract IERC20", "name": "tokenOut", "type": "address" }, { "internalType": "contract ILimitOrderReceiver", "name": "receiver", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "batchFillOrder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "maker", "type": "address" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "startTime", "type": "uint256" }, { "internalType": "uint256", "name": "endTime", "type": "uint256" }, { "internalType": "uint256", "name": "stopPrice", "type": "uint256" }, { "internalType": "contract IOracle", "name": "oracleAddress", "type": "address" }, { "internalType": "bytes", "name": "oracleData", "type": "bytes" }, { "internalType": "uint256", "name": "amountToFill", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "internalType": "struct StopLimitOrder.OrderArgs[]", "name": "order", "type": "tuple[]" }, { "internalType": "contract IERC20", "name": "tokenIn", "type": "address" }, { "internalType": "contract IERC20", "name": "tokenOut", "type": "address" }, { "internalType": "contract ILimitOrderReceiver", "name": "receiver", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "batchFillOrderOpen", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "hash", "type": "bytes32" }], "name": "cancelOrder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "cancelledOrder", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "claimOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "deploymentChainId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "externalOrderFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "feeTo", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "name": "feesCollected", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "maker", "type": "address" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "startTime", "type": "uint256" }, { "internalType": "uint256", "name": "endTime", "type": "uint256" }, { "internalType": "uint256", "name": "stopPrice", "type": "uint256" }, { "internalType": "contract IOracle", "name": "oracleAddress", "type": "address" }, { "internalType": "bytes", "name": "oracleData", "type": "bytes" }, { "internalType": "uint256", "name": "amountToFill", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "internalType": "struct StopLimitOrder.OrderArgs", "name": "order", "type": "tuple" }, { "internalType": "contract IERC20", "name": "tokenIn", "type": "address" }, { "internalType": "contract IERC20", "name": "tokenOut", "type": "address" }, { "internalType": "contract ILimitOrderReceiver", "name": "receiver", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "fillOrder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "maker", "type": "address" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "startTime", "type": "uint256" }, { "internalType": "uint256", "name": "endTime", "type": "uint256" }, { "internalType": "uint256", "name": "stopPrice", "type": "uint256" }, { "internalType": "contract IOracle", "name": "oracleAddress", "type": "address" }, { "internalType": "bytes", "name": "oracleData", "type": "bytes" }, { "internalType": "uint256", "name": "amountToFill", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "internalType": "struct StopLimitOrder.OrderArgs", "name": "order", "type": "tuple" }, { "internalType": "contract IERC20", "name": "tokenIn", "type": "address" }, { "internalType": "contract IERC20", "name": "tokenOut", "type": "address" }, { "internalType": "contract ILimitOrderReceiver", "name": "receiver", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "fillOrderOpen", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "orderStatus", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pendingOwner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "permitToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_feeTo", "type": "address" }, { "internalType": "uint256", "name": "_externalOrderFee", "type": "uint256" }], "name": "setFees", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }], "name": "swipe", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }], "name": "swipeFees", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }, { "internalType": "bool", "name": "direct", "type": "bool" }, { "internalType": "bool", "name": "renounce", "type": "bool" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract ILimitOrderReceiver", "name": "receiver", "type": "address" }], "name": "whiteListReceiver", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]