import type { Config } from "./types";
import astar from "./astar";

const all = {
  astar,
} satisfies Record<string, Config>;

export default all;
