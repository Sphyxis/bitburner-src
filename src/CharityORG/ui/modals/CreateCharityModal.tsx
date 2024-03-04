import React, { useState } from "react";
import { CharityORGConstants } from "../../data/Constants";
import { Money } from "../../../ui/React/Money";
import { Modal } from "../../../ui/React/Modal";
import { Router } from "../../../ui/GameRoot";
import { Page } from "../../../ui/Router";
import { formatMoney, formatNumber } from "../../../ui/formatNumber";
import { Player } from "@player";
import Typography from "@mui/material/Typography";
import { ButtonWithTooltip } from "../../../ui/Components/ButtonWithTooltip";
import TextField from "@mui/material/TextField";
import { joinFaction } from "../../../Faction/FactionHelpers";
import { Factions } from "../../../Faction/Factions";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCharityModal(props: IProps): React.ReactElement {
  const canSelfFund = Player.canAfford(CharityORGConstants.CharityMoneyRequirement);
  const [name, setName] = useState("");

  if (!Player.canAccessCharity() || Player.charityORG) {
    props.onClose();
    return <></>;
  }

  const disabledTextForNoName = name === "" ? "Enter a name for the charity" : "";

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setName(event.target.value);
  }

  function selfFund(): void {
    if (!canSelfFund) return;
    if (name == "") return;

    Player.startCharity(name, false);
    Player.loseMoney(CharityORGConstants.CharityMoneyRequirement, "charityORG");
    joinFaction(Factions.Charity);
    if (Player.charityORG !== null) Player.charityORG.ascensionToken += 50;
    props.onClose();
    Router.toPage(Page.CharityORG);
  }

  function seed(): void {
    if (name == "") {
      return;
    }

    Player.startCharity(name, true);
    joinFaction(Factions.Charity);
    if (Player.charityORG !== null) Player.charityORG.ascensionToken += 20;
    props.onClose();
    Router.toPage(Page.CharityORG);
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Would you like to start a charity? This will require{" "}
        <Money money={CharityORGConstants.CharityMoneyRequirement} forPurchase={true} /> for registration and initial
        funding and will leave your charity with {formatMoney(CharityORGConstants.CharityMoneySelfFund)}.{" "}
        {Player.bitNodeN === 15 && (
          <>
            OR you can take over an existing, failing charity for free but have it start with{" "}
            {formatNumber(CharityORGConstants.CharityMoneySeedFund)}.
          </>
        )}
        <br />
        <br />
        If you would like to start one, please enter a name for your charity below:
      </Typography>
      <br />
      <TextField autoFocus={true} placeholder="Charity Name" onChange={onChange} value={name} />
      {Player.bitNodeN === 15 && (
        <ButtonWithTooltip onClick={seed} disabledTooltip={disabledTextForNoName}>
          Take free charity
        </ButtonWithTooltip>
      )}
      <ButtonWithTooltip
        onClick={selfFund}
        disabledTooltip={disabledTextForNoName || (canSelfFund ? "" : "Insufficient player funds")}
      >
        Self-Fund (<Money money={CharityORGConstants.CharityMoneySelfFund} forPurchase={true} />)
      </ButtonWithTooltip>
    </Modal>
  );
}