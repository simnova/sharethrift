import Apollo, {server} from './init/apollo';

module.exports = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});