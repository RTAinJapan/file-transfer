type TwitchGQLResponse = ComscoreStreamingQuery[];
interface ComscoreStreamingQuery {
  data: {
    user: {
      id: string;
      /** チャンネル名 */
      displayName: string;
      stream: {
        id: string;
        /** @example '2021-08-09T03:55:41Z' */
        createdAt: string;
        game: {
          id: string;
          /** @example 'Pokémon X/Y' */
          name: string;
          __typename: 'Game';
        };
        __typename: 'Stream';
      };
      broadcastSettings: {
        id: string;
        /** 配信タイトル */
        title: string;
        __typename: 'BroadcastSettings';
      };
      __typename: 'User';
    };
  };
  extensions: {
    durationMilliseconds: number;
    operationName: 'ComscoreStreamingQuery';
    requestID: string;
  };
}
