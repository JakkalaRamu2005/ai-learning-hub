import mongoose from "mongoose";

const ToolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    description:{
        type:String,
        required: true,
    }
    ,
    link:{
        type:String,
        required:true,
    },
    pricing:{
        type:String,
        required: true,
    },
    weekAdded:{
        type:String,
        default:"",
    },
    createdAt:{
        type: Date, 
        default: Date.now,
    }
})

export default mongoose.models.Tool || mongoose.model("Tool", ToolSchema);
