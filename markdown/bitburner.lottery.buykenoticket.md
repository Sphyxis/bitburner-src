<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [bitburner](./bitburner.md) &gt; [Lottery](./bitburner.lottery.md) &gt; [buyKenoTicket](./bitburner.lottery.buykenoticket.md)

## Lottery.buyKenoTicket() method

Buy a Keno ticket

**Signature:**

```typescript
buyKenoTicket(wager: number, numbers: number[]): boolean;
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
// Buy a Keno ticket.
ns.lotto.buyKenoTicket(500, [2,12,15,22,27,42,45,8,55,66]);
ns.lotto.buyKenoTicket(500, [2,12,15,22,27]);

// Purchase a lotto 6/49 ticket and one at random.
```
