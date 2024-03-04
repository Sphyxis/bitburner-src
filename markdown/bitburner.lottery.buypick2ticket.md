<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [bitburner](./bitburner.md) &gt; [Lottery](./bitburner.lottery.md) &gt; [buyPick2Ticket](./bitburner.lottery.buypick2ticket.md)

## Lottery.buyPick2Ticket() method

Buy a Pick 2 ticket

**Signature:**

```typescript
buyPick2Ticket(wager: number, numbers: number[]): boolean;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  wager | number | The bet you will be placing. Between 1-500 |
|  numbers | number\[\] | An array of numbers that you are selecting. |

**Returns:**

boolean

True if the ticket was purchased, or false if it was not.

## Remarks

RAM cost: 0 GB

## Example


```ts
// Buy a Pick 2 ticket.
ns.lotto.buyPick2Ticket(500, [0,3]);

// Purchase a pick2 ticket that you specify, and one with a random number selection
```
