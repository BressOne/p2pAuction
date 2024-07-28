export type Auction = {
    item: string;
    startPrice: number;
    bids: Bid[];
}

export type Bid = {
    bidder: string;
    amount: number;
}