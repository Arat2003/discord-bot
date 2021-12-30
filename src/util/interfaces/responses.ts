export const enum ErrorResponses {
  MORE_THAN_ENOUGH_ARGS = "You provided more arguments than required.",
  WRONG_OR_MISSING_USER = "Please specify a valid username or UUID.",
  WRONG_GUILD = "Please specify a valid guild.",
  USER_NOT_SPECIFIED = "Try specifying a user, or verifying your account with `h!verify <username>`.",
  USER_NOT_LOGGED_INTO_HYPIXEL = "This user has never played in Hypixel.",
  USER_NOT_IN_A_HYPIXEL_GUILD = "This user hasn't joined a guild.",
  NO_FRIENDS_HYPIXEL = "This user doesn't have any friend added yet :cry:.",
  NOT_ENOUGH_USERS = "You didn't specify enough usernames to execute this command.",
  USER_UNAUTHORIZED = "You don't have access to this command. Users with the `ADMINISTATOR` permission or with a whitelisted role are allowed to execute it.",
  USER_NOT_VERIFIED = "You're not verified yet! To do so and to be able to execute this command, type h!verify <username>.",
  FAILED_TO_VERIFY = "Failed to verify. \nMake sure you've set your discord on Hypixel to",
}

export const enum HttpStatusCodes {
  SUCCESSFUL_REQUEST = 200,
  INVALID_SYNTAX = 400,
  UNAUTHENTICATED = 401,
  UNAUTHORIZED = 403,
  NOT_FOUND = 404,
  TIMED_OUT = 408,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
}
