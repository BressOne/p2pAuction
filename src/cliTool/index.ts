import readline from 'readline'

export const cliDevTool = (peersBee, rpc) => {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    console.log('Auction node running. Type commands to interact:')
    console.log('Commands: open-auction, place-bid, close-auction')

    rl.on('line', async (input) => {
        const args = input.split(' ')

        switch (args[0]) {
            case 'open-auction':
                const [openAuctionId, openItem, openStartPrice] = args.slice(1)
                const openPayload = { auctionId: openAuctionId, item: openItem, startPrice: parseFloat(openStartPrice) }
                // Broadcast open-auction request to all peers
                const peersList = await peersBee.createReadStream().toArray()
                for (const { key: peer } of peersList) {
                    await rpc.request(Buffer.from(peer, 'hex'), 'open-auction', Buffer.from(JSON.stringify(openPayload), 'utf-8'))
                }
                break
            case 'place-bid':
                const [placeAuctionId, placeBidder, placeAmount] = args.slice(1)
                const placePayload = { auctionId: placeAuctionId, bidder: placeBidder, amount: parseFloat(placeAmount) }
                // Broadcast place-bid request to all peers
                const peersList2 = await peersBee.createReadStream().toArray()
                for (const { key: peer } of peersList2) {
                    await rpc.request(Buffer.from(peer, 'hex'), 'place-bid', Buffer.from(JSON.stringify(placePayload), 'utf-8'))
                }
                break
            case 'close-auction':
                const [closeAuctionId] = args.slice(1)
                const closePayload = { auctionId: closeAuctionId }
                // Broadcast close-auction request to all peers
                const peersList3 = await peersBee.createReadStream().toArray()
                for (const { key: peer } of peersList3) {
                    await rpc.request(Buffer.from(peer, 'hex'), 'close-auction', Buffer.from(JSON.stringify(closePayload), 'utf-8'))
                }
                break
            default:
                console.log('Unknown command')
        }
    })
}