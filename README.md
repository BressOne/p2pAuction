
# p2pAuction Documentation

## Overview

The `p2pAuction` project is a peer-to-peer (P2P) auction system using Hyperswarm RPC and Hyperbee for persistent storage. It allows users to open auctions, place bids, and close auctions, with all actions being propagated across the P2P network.

## Project Structure

-   **src/**: Contains the TypeScript source files.
    -   **p2pNode.ts**: The main entry point for the P2P auction node.
-   **db/**: Directory for Hypercore databases used by Hyperbee for persistent storage.

## Setup Instructions

1.  **Install Dependencies**:
    `npm install` 
2.  **Start the DHT Bootstrap Node**:
    `npx hyperdht --bootstrap --host 127.0.0.1 --port 30001` 
    
3.  **Run Multiple Instances of the P2P Node**:
    `npx ts-node src/p2pNode.ts` 
## Commands

1.  **Open an Auction**:
    `open-auction <auctionId> <item> <startPrice>`   
    Example:
    `open-auction auction1 "Pic#1" 75` 
    
2.  **Place a Bid**:
    `place-bid <auctionId> <bidder> <amount>` 
    Example:
    `place-bid auction1 "Client#2" 80` 
3.  **Close an Auction**:
    `close-auction <auctionId>` 
    Example:
    `close-auction auction1` 

## Implementation Details

-   **Hyperbee for Persistent Storage**:
    
    -   Auctions and peers are stored using Hyperbee, which provides a simple key-value store on top of Hypercore.
    -   The `auctionsBee` and `peersBee` instances are used to interact with the auction and peer data.
-   **RPC Handlers**:
    
    -   The `rpcServer` handles three types of requests: `open-auction`, `place-bid`, and `close-auction`.
    -   Each handler validates the request using Zod schemas, updates the auction data in Hyperbee, and broadcasts the action to all peers.

## Example Usage

Use env variable NODE_ENV=development to start `src/p2pNode.ts` with CLI open for dev purpouses.

1.  Start the DHT bootstrap node:
    `npx hyperdht --bootstrap --host 127.0.0.1 --port 30001` 

2.  Run three instances of the P2P node:
    `NODE_ENV=development npx ts-node src/p2pNode.ts` 
    
3.  In the first node, open an auction:
    `open-auction auction1 "Pic#1" 75` 
    
4.  In the second node, open another auction:
    `open-auction auction2 "Pic#2" 60` 
    
5.  Place bids from different nodes:
	`place-bid auction1 "Client#2" 80`
	`place-bid auction1 "Client#3" 75.5`
	`place-bid auction1 "Client#2" 85`    
6.  Close the auction from the first node:
    `close-auction auction1` 
## Task Coverage

The solution mostly covers the task requirements:

-   **P2P Architecture**: The system uses Hyperswarm RPC for P2P communication and Hyperbee for distributed storage.
-   **Opening Auctions**: Clients can open auctions.
-   **Placing Bids**: Clients can place bids on open auctions.
-   **Closing Auctions**: Clients can close auctions, notifying all peers.

## Limitations and TODOs

1.  **Peer Discovery**:
    
    -   Currently, peers must manually share their public keys. Implement a better peer discovery mechanism.
2.  **Handling Peer Disconnections**:
    
    -   Add logic to handle disconnections gracefully and update the peers list.
3.  **Data Validation**:
    
    -   Improve data validation and error handling in RPC handlers.
4.  **Better CLI**:
    
    -   Enhance the CLI to provide better user feedback and support for more commands.
5.  **Testing**:
    
    -   Add automated tests to ensure all functionalities work as expected.
6.  **Improved Logging**:
    
    -   Add better logging for debugging and monitoring purposes.
7.  **Concurrency Issues**:
    
    -   Ensure that concurrent operations on auctions are handled correctly.
8.  **Security**:
    
    -   Implement security measures to ensure the integrity and authenticity of transactions.

## Improvements

-   **Refactor Code**: Split the code into multiple modules for better readability and maintenance.
-   **Documentation**: Improve documentation with more details on each component and usage instructions.
-   **User Authentication**: Implement a simple authentication mechanism to identify clients.
-   **Transaction History**: Maintain a history of all transactions for auditing purposes.

----------

This documentation should help you understand and use the `p2pAuction` system effectively. For further improvements, follow the TODO list and limitations outlined above.