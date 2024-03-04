import React, { useState } from "react";
import { getRandomInt } from "../utils/helpers/getRandomInt";
import { Player } from "@player";
import { ToastVariant } from "@enums";
import { TicketRecord, GameType, GameOptions } from "./LotteryStoreLocationInside";
import { LotteryConstants } from "./data/LotteryConstants";
import { SnackbarEvents } from "../ui/React/Snackbar";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export function L649(): React.ReactElement {
  const [wager, setBet] = useState(0);
  const [num1, setBetNum1Result] = useState(-1);
  const [num2, setBetNum2Result] = useState(-1);
  const [num3, setBetNum3Result] = useState(-1);
  const [num4, setBetNum4Result] = useState(-1);
  const [num5, setBetNum5Result] = useState(-1);
  const [num6, setBetNum6Result] = useState(-1);

  function resetBet(): void {
    setBetNum1Result(-1);
    setBetNum2Result(-1);
    setBetNum3Result(-1);
    setBetNum4Result(-1);
    setBetNum5Result(-1);
    setBetNum6Result(-1);
    const elems = document.getElementsByTagName("input");
    for (const elem of elems) {
      if (elem.name === "betnum") {
        elem.value = "";
      }
    }
  }
  function updateBet(e: React.ChangeEvent<HTMLInputElement>): void {
    let bet: number = parseInt(e.currentTarget.value);
    if (isNaN(bet)) {
      bet = -1;
    }
    if (bet > LotteryConstants.MaxPlay) {
      bet = LotteryConstants.MaxPlay;
    }
    if (bet < LotteryConstants.MinPlay) {
      bet = -1;
    }
    setBet(bet);
    e.currentTarget.value = bet > 0 ? bet.toString() : "";
  }
  function updateNum1(e: React.ChangeEvent<HTMLInputElement>): void {
    const chosen: number = parseInt(e.currentTarget.value);
    if (isNaN(chosen)) {
      e.currentTarget.value = "";
      setBetNum1Result(-1);
    } else if (chosen > 49) {
      e.currentTarget.value = "";
      setBetNum1Result(-1);
    } else {
      setBetNum1Result(chosen);
    }
  }
  function updateNum2(e: React.ChangeEvent<HTMLInputElement>): void {
    const chosen: number = parseInt(e.currentTarget.value);
    if (isNaN(chosen)) {
      e.currentTarget.value = "";
      setBetNum2Result(-1);
    } else if (chosen > 49) {
      e.currentTarget.value = "";
      setBetNum2Result(-1);
    } else {
      setBetNum2Result(chosen);
    }
  }
  function updateNum3(e: React.ChangeEvent<HTMLInputElement>): void {
    const chosen: number = parseInt(e.currentTarget.value);
    if (isNaN(chosen)) {
      e.currentTarget.value = "";
      setBetNum3Result(-1);
    } else if (chosen > 49) {
      e.currentTarget.value = "";
      setBetNum3Result(-1);
    } else {
      setBetNum3Result(chosen);
    }
  }
  function updateNum4(e: React.ChangeEvent<HTMLInputElement>): void {
    const chosen: number = parseInt(e.currentTarget.value);
    if (isNaN(chosen)) {
      e.currentTarget.value = "";
      setBetNum4Result(-1);
    } else if (chosen > 49) {
      e.currentTarget.value = "";
      setBetNum4Result(-1);
    } else {
      setBetNum4Result(chosen);
    }
  }
  function updateNum5(e: React.ChangeEvent<HTMLInputElement>): void {
    const chosen: number = parseInt(e.currentTarget.value);
    if (isNaN(chosen)) {
      e.currentTarget.value = "";
      setBetNum5Result(-1);
    } else if (chosen > 49) {
      e.currentTarget.value = "";
      setBetNum5Result(-1);
    } else {
      setBetNum5Result(chosen);
    }
  }
  function updateNum6(e: React.ChangeEvent<HTMLInputElement>): void {
    const chosen: number = parseInt(e.currentTarget.value);
    if (isNaN(chosen)) {
      e.currentTarget.value = "";
      setBetNum6Result(-1);
    } else if (chosen > 49) {
      e.currentTarget.value = "";
      setBetNum6Result(-1);
    } else {
      setBetNum6Result(chosen);
    }
  }
  function canBuy(): boolean {
    // Used for checking the buy condition
    const numcollection: number[] = [];
    if (num1 > 0) {
      numcollection.push(num1);
    }
    if (num2 > 0) {
      numcollection.push(num2);
    }
    if (num3 > 0) {
      numcollection.push(num3);
    }
    if (num4 > 0) {
      numcollection.push(num4);
    }
    if (num5 > 0) {
      numcollection.push(num5);
    }
    if (num6 > 0) {
      numcollection.push(num6);
    }
    if (numcollection.length !== 6) {
      return false;
    }

    for (const num of numcollection) {
      if (numcollection.filter((x) => x === num).length > 1) return false;
    }
    return true;
  }

  function buyTicket(): void {
    if (wager <= 0) {
      dialogBoxCreate("You must wager something");
      return;
    }
    if (!canBuy()) {
      dialogBoxCreate("You must pick 6 unique numbers, between 1-49");
      return;
    }
    if (Player.lotteryTickets.length >= LotteryConstants.MaxTickets) {
      dialogBoxCreate("You cannot hold any more tickets.");
      return;
    }

    const numarray: number[] = [];
    numarray.push(num1);
    numarray.push(num2);
    numarray.push(num3);
    numarray.push(num4);
    numarray.push(num5);
    numarray.push(num6);
    const option = GameOptions.None;

    const betrecord = new TicketRecord(GameType.L649, numarray, wager, option);
    Player.loseMoney(wager, "lottery");
    Player.lotteryTickets.push(betrecord);

    const PurchaseToast = (
      <>
        Purchased a ticket! Type:{betrecord.Type} Bet:{betrecord.Wager} Numbers:{numarray[0]},{numarray[1]},
        {numarray[2]},{numarray[3]},{numarray[4]},{numarray[5]},{numarray[6]} Options:{betrecord.Option}
      </>
    );
    SnackbarEvents.emit(PurchaseToast, ToastVariant.INFO, 2000);
    resetBet();
  }

  function buyRandomTicket(): void {
    if (wager <= 0) {
      dialogBoxCreate("You must wager something");
      return;
    }
    if (Player.lotteryTickets.length >= LotteryConstants.MaxTickets) {
      dialogBoxCreate("You cannot hold any more tickets.");
      return;
    }

    const numarray: number[] = [];
    let z = getRandomInt(1, 49);
    setBetNum1Result(z);
    numarray.push(z);
    while (numarray.includes(z)) {
      z = getRandomInt(1, 49);
    }
    setBetNum2Result(z);
    numarray.push(z);
    while (numarray.includes(z)) {
      z = getRandomInt(1, 49);
    }
    setBetNum3Result(z);
    numarray.push(z);
    while (numarray.includes(z)) {
      z = getRandomInt(1, 49);
    }
    setBetNum4Result(z);
    numarray.push(z);
    while (numarray.includes(z)) {
      z = getRandomInt(1, 49);
    }
    setBetNum5Result(z);
    numarray.push(z);
    while (numarray.includes(z)) {
      z = getRandomInt(1, 49);
    }
    setBetNum6Result(z);
    numarray.push(z);

    const option = GameOptions.None;

    const betrecord = new TicketRecord(GameType.L649, numarray, wager, option);
    Player.loseMoney(wager, "lottery");
    Player.lotteryTickets.push(betrecord);

    const PurchaseToast = (
      <>
        Purchased a ticket! Type:{betrecord.Type} Bet:{betrecord.Wager} Numbers:{numarray[0]},{numarray[1]},
        {numarray[2]},{numarray[3]},{numarray[4]},{numarray[5]},{numarray[6]} Options:{betrecord.Option}
      </>
    );
    SnackbarEvents.emit(PurchaseToast, ToastVariant.INFO, 2000);
    resetBet();
  }
  function showOdds(): void {
    dialogBoxCreate(
      "Lotto 6/49 Winnings.\n" +
        "Based on a $1 bet\n\n" +
        "6 of 6        : $1,666,666  3 of 6         : $3.33\n" +
        "5 of 6 + Bonus:   $533,333  2 of 6 + bonus : $1.67\n" +
        "5 of 6        :   $225,000  2 of 6         : $1.00\n" +
        "4 of 6        :    $66,666",
    );
  }

  return (
    <>
      <Typography>Lotto 6/49</Typography>
      <Typography>
        <br />
      </Typography>
      <Typography>Bet:</Typography>
      <Box display="flex" alignItems="center">
        <TextField
          type="number"
          style={{
            width: "100px",
          }}
          onChange={updateBet}
          placeholder={String(wager)}
        />
        <Typography>Bet Amount - Up to $500 per ticket</Typography>
      </Box>
      <br />
      <Box display="flex" alignItems="center">
        <Typography>1st:</Typography>
        <TextField
          type="number"
          name="betnum"
          style={{
            width: "50px",
          }}
          onChange={updateNum1}
        />
        <Typography>&nbsp;2nd:</Typography>
        <TextField
          type="number"
          name="betnum"
          style={{
            width: "50px",
          }}
          onChange={updateNum2}
        />
        <Typography>&nbsp;3rd:</Typography>
        <TextField
          type="number"
          name="betnum"
          style={{
            width: "50px",
          }}
          onChange={updateNum3}
        />
        <Typography>&nbsp;4th:</Typography>
        <TextField
          type="number"
          name="betnum"
          style={{
            width: "50px",
          }}
          onChange={updateNum4}
        />
        <Typography>&nbsp;5th:</Typography>
        <TextField
          type="number"
          name="betnum"
          style={{
            width: "50px",
          }}
          onChange={updateNum5}
        />
        <Typography>&nbsp;6th:</Typography>
        <TextField
          type="number"
          name="betnum"
          style={{
            width: "50px",
          }}
          onChange={updateNum6}
        />
      </Box>
      <br />
      <br />
      <Button onClick={() => buyTicket()}>Buy ticket</Button>,{" "}
      <Button onClick={() => buyRandomTicket()}>Buy random ticket</Button>
      <Box display="-ms-grid" alignItems="left" whiteSpace="pre">
        <Typography>----------------------------</Typography>
        <br />
        <Typography>Rules:</Typography>
        <br />
        <Typography>Pick 6 unique numbers, between 1 and 49</Typography>
        <Button onClick={() => showOdds()}>Show Winnings Chart</Button>
      </Box>
    </>
  );
}