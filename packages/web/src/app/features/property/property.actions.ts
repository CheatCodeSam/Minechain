import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const initialize = createAsyncThunk("property/initialize", async () => {
  const res = await axios.get("api/v1/users/properties")
  return { properties: res.data }
})
