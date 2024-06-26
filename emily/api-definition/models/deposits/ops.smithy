$version: "2.0"

namespace stacks.sbtc

@idempotent
@http(method: "POST", uri: "/deposits")
operation CreateDeposit {
    input: CreateDepositInput
    output: DepositData
    errors: [
        ServiceError
        ThrottlingError
        ConflictError
        NotImplementedError
        BadRequestError
    ]
}

@input
structure CreateDepositInput {
    @required bitcoinTxid: Base64EncodedBinary
    @required bitcoinTxOutputIndex: Integer
    @required reclaim: Base64EncodedBinary
    @required deposit: Base64EncodedBinary
}

@readonly
@http(method: "GET", uri: "/deposits/{txid}/{outputIndex}")
operation GetDeposit {
    input := for Deposit {
        @httpLabel @required $txid
        @httpLabel @required $outputIndex
    }
    output: DepositData
    errors: [
        ServiceError
        ThrottlingError
        NotFoundError
        NotImplementedError
        BadRequestError
    ]
}

@readonly
@http(method: "GET", uri: "/deposits/{txid}")
@paginated(
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
    items: "deposits",
)
operation GetTxnDeposits {
    input: GetTxnDepositsInput
    output: GetTxnDepositsOutput
    errors: [
        ServiceError
        ThrottlingError
        NotFoundError
        NotImplementedError
        BadRequestError
    ]
}

@input
structure GetTxnDepositsInput {
    @httpLabel @required txid: String
    @httpQuery("maxResults") maxResults: Integer
    @httpQuery("nextToken") nextToken: String
}

@output
structure GetTxnDepositsOutput {
    nextToken: String
    deposits: DepositDataList
}

@readonly
@http(method: "GET", uri: "/deposits")
@paginated(
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
    items: "deposits",
)
operation GetDeposits {
    input: GetDepositsInput
    output: GetDepositsOutput
    errors: [
        ServiceError
        ThrottlingError
        NotFoundError
        NotImplementedError
        BadRequestError
    ]
}

@input
structure GetDepositsInput {
    @httpQuery("maxResults") maxResults: Integer
    @httpQuery("nextToken") nextToken: String
    @httpQuery("status") status: OpStatus
}

@output
structure GetDepositsOutput {
    nextToken: String
    deposits: DepositBasicInfoList
}

@idempotent
@http(method: "PUT", uri: "/deposits")
operation UpdateDeposits {
    input: UpdateDepositsInput
    output: UpdateDepositsOutput
    errors: [
        ServiceError
        ThrottlingError
        NotFoundError
        ConflictError
        ForbiddenError
        NotImplementedError
        BadRequestError
    ]
}

@input
structure UpdateDepositsInput {
    @required deposits: DepositUpdateList
}

@output
structure UpdateDepositsOutput {
    deposits: DepositDataList
}
