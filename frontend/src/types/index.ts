export interface RedirectResult {
  oauth: {
    provider: string;
    scope: string[];
    accessToken: string;
    userHandle: string;
    userInfo: {
      sub: string;
      name: string;
      familyName: string;
      givenName: string;
      picture: string;
      email: string;
      emailVerified: boolean;
      sources: {
        [key: string]: {
          sub: string;
          name: string;
          givenName: string;
          familyName: string;
          picture: string;
          email: string;
          emailVerified: boolean;
        };
      };
    };
  };
  magic: {
    idToken: string;
    userMetadata: {
      issuer: string;
      publicAddress: string;
      email: string;
      phoneNumber: string | null;
      isMfaEnabled: boolean;
      recoveryFactors: [];
    };
  };
}

export interface User {
  _id: {
    $oid: string;
  };
  firstname: string;
  lastname: string;
  wallet_address: string;
  email: string;
  team_id: {
    $oid: string;
  };
  image: string;
  refs: string[];
  refs_as: null;
  refs_link: string;
  stamina: number;
  is_online: boolean;
}

export interface UpdateTeamResponse {
  team: Team;
  users: User[];
}

interface ObjectId {
  $oid: string;
}

interface Team {
  _id: ObjectId;
  name: string;
  captain_id: ObjectId;
  total_token: number;
  total_commit: number;
  total_bugs: number;
  members: ObjectId[];
  followers: number;
}

interface TeamUnity {
  name: string;
  quantity: number;
  total_token: number;
  total_commit: number;
  total_bug: number;
}

interface UserUnity {
  id: string;
  name: string;
  stamina: number;
  is_online: boolean;
}

export interface UpdateTeamDataUnity {
  team: TeamUnity;
  users: UserUnity[];
  id_user_playing: string;
}
