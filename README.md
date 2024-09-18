# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

webRtc is Peer 2 peer connection

webSocket and webRetc both of them used for Real time communication

webSocket :-
1 for chatApp
2 TCP protocol reliable portocol

webRtc:-
1 for Vedio Call
2 UDP protocol it is faster than TCP
3

signalling: for both the clients to actually know each other we need setup a mechanism

ICE Server:It used to relay data between peers and it is used when a direct connection is not possible

TURN Server:It used to relay data between peers and it is used when a direct connection is not possible

STUN Server:It Give pulic Ip addrss it set in peer object there is my free google stun server

SDP:type of file and alot of information
protocol:for setup a connection there are some rules to connect
SDP packet contain the following packet:-
1 information of desc multimedia content
2 format of multimedia
