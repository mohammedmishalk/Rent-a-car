import axios from "../../api/axios";
// import { config } from "../../Helpers/axiosAdminEndpoints";

export const getAllCars=()=>async dispatch=>{

    dispatch({type:"LOADING",payload:true})

    try {
        const response=await axios.get('/admin/getallcars')
        dispatch({type:"GET_ALL_CARS",payload:response.data})

        dispatch({type:"LOADING",payload:false})

    } catch (error) {
        console.log(error)
        dispatch({type:"LOADING",payload:false})

    }
}