import { alice, deposit, errors, registry } from "./helpers";
import { test, expect, describe } from "vitest";
import { txOk, filterEvents, rov, txErr } from "@clarigen/test";
import { CoreNodeEventType, cvToValue } from "@clarigen/core";

describe("sBTC deposit contract", () => {
  describe("complete deposit contract setup (err 300)", () => {
    test("Fail complete-deposit-wrapper invalid txid length", () => {
      const receipt = txErr(
        deposit.completeDepositWrapper({
          txid: new Uint8Array(31).fill(0),
          voutIndex: 0,
          amount: 1000n,
          recipient: alice,
        }),
        alice
      );
      expect(receipt.value).toEqual(errors.deposit.ERR_TXID_LEN);
    });

    test("Fail complete-deposit-wrapper invalid low amount", () => {
      const receipt = txErr(
        deposit.completeDepositWrapper({
          txid: new Uint8Array(32).fill(0),
          voutIndex: 0,
          amount: 10n,
          recipient: alice,
        }),
        alice
      );
      expect(receipt.value).toEqual(deposit.constants.ERR_LOWER_THAN_DUST.value);
    });

    test("Fail complete-deposit-wrapper replay deposit (err 301)", () => {
      const receipt0 = txOk(
        deposit.completeDepositWrapper({
          txid: new Uint8Array(32).fill(0),
          voutIndex: 0,
          amount: 1000n,
          recipient: alice,
        }),
        alice
      );
      expect(receipt0.value).toEqual(true);
      const receipt1 = txErr(
        deposit.completeDepositWrapper({
          txid: new Uint8Array(32).fill(0),
          voutIndex: 0,
          amount: 1000n,
          recipient: alice,
        }),
        alice
      );
      expect(receipt1.value).toEqual(errors.deposit.ERR_DEPOSIT_REPLAY);
    });

    test("Call complete-deposit-wrapper placeholder, check print", () => {
      const receipt = txOk(
        deposit.completeDepositWrapper({
          txid: new Uint8Array(32).fill(0),
          voutIndex: 0,
          amount: 1000n,
          recipient: alice,
        }),
        alice
      );
      const printEvents = filterEvents(
        receipt.events,
        CoreNodeEventType.ContractEvent
      );
      const [print] = printEvents;
      const printData = cvToValue<{
        topic: string;
        txid: string;
        voutIndex: bigint;
        amount: bigint;
      }>(print.data.value);
      expect(printData).toStrictEqual({
        topic: "completed-deposit",
        txid: new Uint8Array(32).fill(0),
        voutIndex: 0n,
        amount: 1000n,
      });
    });

    test("Call get-complete-deposit placeholder", () => {
      txOk(
        deposit.completeDepositWrapper({
          txid: new Uint8Array(32).fill(0),
          voutIndex: 0,
          amount: 1000n,
          recipient: alice,
        }),
        alice
      );
      const receipt1 = rov(
        registry.getCompletedDeposit({
          txid: new Uint8Array(32).fill(0),
          voutIndex: 0,
        }),
        alice
      );
      expect(receipt1).toStrictEqual({
        amount: 1000n,
        recipient: alice,
      });
    });
  });
});
