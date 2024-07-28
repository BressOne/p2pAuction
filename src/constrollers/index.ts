import { Auction } from "../types/common"
import { openAuctionSchema, placeBidSchema, closeAuctionSchema } from "../validation/schemas"

export const openAuction = (auctionsBee) => async (reqRaw: Buffer) => {
    const req = openAuctionSchema.safeParse(JSON.parse(reqRaw.toString('utf-8')))
    if (!req.success) {
        return Buffer.from(JSON.stringify({ error: 'Invalid request.' }), 'utf-8')
    }
    const { auctionId, item, startPrice } = req.data
    const existingAuction = await auctionsBee.get(auctionId)
    if (existingAuction) {
        return Buffer.from(JSON.stringify({ error: 'Auction with this ID already exists.' }), 'utf-8')
    }
    await auctionsBee.put(auctionId, { item, startPrice, bids: [] })
    return Buffer.from(JSON.stringify({ success: true }), 'utf-8')
}

export const placeBid = (auctionsBee) => async (reqRaw: Buffer) => {
    const req = placeBidSchema.safeParse(JSON.parse(reqRaw.toString('utf-8')))
    if (!req.success) {
        return Buffer.from(JSON.stringify({ error: 'Invalid request.' }), 'utf-8')
    }
    const { auctionId, bidder, amount } = req.data
    const auctionEntry = await auctionsBee.get(auctionId)
    if (!auctionEntry) {
        return Buffer.from(JSON.stringify({ error: 'Auction does not exist.' }), 'utf-8')
    }
    const auction: Auction = auctionEntry.value
    const highestBid = auction.bids.length > 0 ? auction.bids[auction.bids.length - 1].amount : auction.startPrice
    if (amount <= highestBid) {
        return Buffer.from(JSON.stringify({ error: 'Bid must be higher than the current highest bid.' }), 'utf-8')
    }
    auction.bids.push({ bidder, amount })
    await auctionsBee.put(auctionId, auction)
    return Buffer.from(JSON.stringify({ success: true }), 'utf-8')
}

export const closeAuction = (auctionsBee) => async (reqRaw: Buffer) => {
    const req = closeAuctionSchema.safeParse(JSON.parse(reqRaw.toString('utf-8')))
    if (!req.success) {
        return Buffer.from(JSON.stringify({ error: 'Invalid request.' }), 'utf-8')
    }
    const { auctionId } = req.data
    const auctionEntry = await auctionsBee.get(auctionId)
    if (!auctionEntry) {
        return Buffer.from(JSON.stringify({ error: 'Auction does not exist.' }), 'utf-8')
    }
    const auction: Auction = auctionEntry.value
    const winningBid = auction.bids.sort((a, b) => b.amount - a.amount)[0]
    await auctionsBee.del(auctionId)
    return Buffer.from(JSON.stringify({ success: true, winningBid }), 'utf-8')
}