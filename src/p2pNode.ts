import RPC from '@hyperswarm/rpc'
import DHT from 'hyperdht'
import Hypercore from 'hypercore'
import Hyperbee from 'hyperbee'
import crypto from 'crypto'
import { closeAuction, openAuction, placeBid } from './constrollers'
import { cliDevTool } from './cliTool'

const initHyperbee = async (name: string) => {
    const core = new Hypercore(`./db/${name}`)
    const bee = new Hyperbee(core, { keyEncoding: 'utf-8', valueEncoding: 'json' })
    await bee.ready()
    return bee
}

const getNamedSeed = async (auctionsBee, key) => {
    const dhtSeed = await auctionsBee.get(key)
    if (!dhtSeed || !dhtSeed.value) {
        const seed = crypto.randomBytes(32)
        await auctionsBee.put(key, dhtSeed)
        return seed
    } else {
        return dhtSeed.value
    }
}

const startDht = async (auctionsBee) => {
    const dhtSeed = await getNamedSeed(auctionsBee, 'dht-seed')
    const dht = new DHT({
        keyPair: DHT.keyPair(dhtSeed),
        bootstrap: [{ host: '127.0.0.1', port: 30001 }] // Replace with actual bootstrap node
    })
    await dht.ready()
    return dht
}

const startRpc = async (auctionsBee, dht) => {
    const rpcSeed = await getNamedSeed(auctionsBee, 'rpc-seed')
    const rpc = new RPC({ seed: rpcSeed, dht })
    const rpcServer = rpc.createServer()
    await rpcServer.listen()
    return { rpcServer, rpc }
}

const main = async () => {
    const auctionsBee = await initHyperbee('auctions')

    const dht = await startDht(auctionsBee)
    const { rpcServer, rpc } = await startRpc(auctionsBee, dht)

    rpcServer.respond('open-auction', openAuction(auctionsBee))
    rpcServer.respond('place-bid', placeBid(auctionsBee))
    rpcServer.respond('close-auction', closeAuction(auctionsBee))


    if (process.env.NODE_ENV === "development") {
        console.log('RPC server started listening on public key:', rpcServer.publicKey.toString('hex'))
        const peersBee = await initHyperbee('peers')
        cliDevTool(peersBee, rpc)
    }

}

main().catch(console.error)
