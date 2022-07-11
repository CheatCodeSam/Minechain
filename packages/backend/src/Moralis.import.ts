import * as MoralisImport from "moralis/node"
import { Moralis as MoralisDef } from "moralis/types/node"

// Moralis has some weird issues with typescript.
export default MoralisImport as unknown as MoralisDef
