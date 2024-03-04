import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Player } from "@player";
import { MenuItem, TextField } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useRerender } from "../../ui/React/hooks";
import { formatNumber } from "../../ui/formatNumber";
import { KarmaAvailable } from "./KarmaAvailable";

/** React Component for the popup that manages Karma spending */
export function KarmaSleeveOverclockSubpage(): React.ReactElement {
  const charityORG = (function () {
    if (Player.charityORG === null) throw new Error("Charity should not be null");
    return Player.charityORG;
  })();
  const rerender = useRerender();
  const [spend, setSpend] = React.useState(0);
  const [currentCategory, setCurrentCategory] = useState("0");
  const onChange = (event: SelectChangeEvent): void => {
    setCurrentCategory(event.target.value);
    rerender();
  };
  const sleeves: string[] = [];
  for (let slv = 0; slv < Player.sleeves.length; slv++) {
    sleeves.push(Player.sleeves[slv].whoAmI());
  }
  sleeves.push("All");

  function updateSpend(e: React.ChangeEvent<HTMLInputElement>): void {
    const spendVal = Number.parseInt(e.currentTarget.value);
    if (spendVal > Player.karma || spendVal < 0) {
      setSpend(0);
      e.currentTarget.value = "";
      return;
    }
    setSpend(spendVal);
  }
  function purchaseOverclock(): void {
    if (spend > Player.karma) return;
    if (currentCategory === String(Player.sleeves.length)) {
      // All is triggered
      const divided = (spend * 2.5) / Player.sleeves.length;
      for (let slv = 0; slv < Player.sleeves.length; slv++) {
        Player.sleeves[slv].storedCycles += divided;
      }
      charityORG.addKarmaMessage(
        "Spent " + formatNumber(spend, 0) + " on " + formatNumber(spend * 2.5, 0) + " overclock for All sleeves",
      );
    } else {
      Player.sleeves[Number(currentCategory)].storedCycles += spend * 2.5;
      charityORG.addKarmaMessage(
        "Spent " +
          formatNumber(spend, 0) +
          " on " +
          formatNumber(spend * 2.5, 0) +
          " overclock for sleeve #" +
          currentCategory,
      );
    }
    Player.karma -= spend;
  }

  const categories: Record<string, string[][]> = {
    Sleeves: [sleeves],
  };

  return (
    <span>
      <Box display="flex">
        <Typography>
          <br></br>Choose your Sleeve:
        </Typography>
      </Box>
      <span>
        <Select onChange={onChange} value={currentCategory} sx={{ width: "15%", mb: 1 }}>
          {Object.keys(categories.Sleeves[0]).map((k, i) => (
            <MenuItem key={i + 1} value={k}>
              <Typography variant="h6">{Player.sleeves.length === i ? "All" : "Sleeve: " + k}</Typography>
            </MenuItem>
          ))}
        </Select>
      </span>
      <br></br>
      <Typography>Karma:</Typography>
      <Box display="grid" alignItems="center">
        <TextField
          id="KarmaSpend"
          type="number"
          style={{
            width: "100px",
          }}
          onChange={updateSpend}
          placeholder={String(spend)}
        />
        <Typography>
          Every 1 karma gives .5 seconds of overclock to a sleeve. If all is selected, will divide it evenly<br></br>
          <KarmaAvailable />
        </Typography>
      </Box>
      <Button onClick={() => purchaseOverclock()}>Purchase Sleeve Overclock</Button>
    </span>
  );
}