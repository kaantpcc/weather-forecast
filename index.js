import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import tzlookup from "tz-lookup";

const app = express();
const port = 3000;
const yourAPIKey = "e0585265e21d20bad04c40b1ece31852";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

let control;
let error=false;

app.get("/", (req,res)=>{
    control = false;
    res.render("index.ejs" , {weather : control});
});

app.post("/search",async(req,res)=>{
    control = true ;
    const cityName = req.body.city;
    try{

        //Get URL
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${yourAPIKey}`);
        const result = response.data;

        //Datas
        const weatherMain = result.weather[0].description;
        const temp = result.main.temp;
        const weatherIcon = result.weather[0].icon;
        const wind = result.wind.speed;
        const humidity = result.main.humidity;
        const feelsLike = result.main.feels_like;
        const pressure = result.main.pressure;

        //Date and Sunset Time
        const date = new Date();
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const currentMonth = date.getMonth();
        const dayOfTheMonth = date.getDate();
        const currentDay = date.getDay();

        //Render
        res.render("index.ejs",{
            weather : control,
            cityName : cityName,
            weatherMain : weatherMain,
            temp : Math.round(temp),
            weatherIcon : weatherIcon,
            wind : wind,
            humidity : humidity,
            feelsLike : Math.round(feelsLike),
            pressure : pressure,
            currentMonth : months[currentMonth],
            dayOfTheMonth : dayOfTheMonth,
            currentDay : days[currentDay],
        });
    }catch(error){
        error=true;
        res.render("index.ejs",{error : "Failed to find city please enter the city name correctly."});
    }
    
});



app.listen(port,()=>{
    console.log("Server is running on port : " + port);
});
