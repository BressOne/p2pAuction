import { z } from 'zod'

export const openAuctionSchema = z.object({
    auctionId: z.string(),
    item: z.string(),
    startPrice: z.number().positive(),
})

export const placeBidSchema = z.object({
    auctionId: z.string(),
    bidder: z.string(),
    amount: z.number().positive(),
})

export const closeAuctionSchema = z.object({
    auctionId: z.string(),
})