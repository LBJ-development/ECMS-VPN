// HOME PAGE NOTIFICATIONS  ////////////////////////////////////////////////////////////
function generatenotification(rowscount, hasNullValues) {
    // prepare the data
    var data = new Array();
    if (rowscount == undefined) rowscount = 100;

    var events =
    [
        "User Profile", "Case", "TA", "Assistance Request"
    ];

    var objects =
    [
        "p-200", "C-45678", "Team Adam", "Biometrics"
    ];

    var details =
    [
        "CaseLoad has been updated", "Hair color changed", "TAC assigned", "DNA sample request for Sally Lones..."
    ];

    var users =
    [
         "Hala", "Hung", "Heather", "Ballu", "Dave", "Andrey", "Brian", "Ludwig"
    ];

    for (var i = 0; i < rowscount; i++) {
        var row = {};

        row["id"] = i + 1;
        row["events"] = events[Math.floor(Math.random() * events.length)];
        row["objects"] = objects[Math.floor(Math.random() * objects.length)];
        row["details"] = details[Math.floor(Math.random() * details.length)];
        row["users"] = users[Math.floor(Math.random() * users.length)];
		row["seen"] = false;
       
        data[i] = row;
    }

    return data;
}
// CASE ADMINISTRATION MAIN PAGE ////////////////////////////////////////////////////////////
function generateCaseAdminData(rowscount, hasNullValues) {
    // prepare the data
    var data = new Array();
    if (rowscount == undefined) rowscount = 100;

    var cases = [
        "C-133467" , "C-123567" , "C-127467" , "C-128467" , "C-243467" , "C-136467" , "C-189467" , "C-123487" , "C-178467" , "C-123484" , "C-363467" , "C-178567" , "C-175367" , "C-1148467" , "C-965467" , "C-743467" , "C-121248" , "C-154767" , "C-123567" , "C-369467" , "C-129667" , "C-247467" , "C-654467" , "C-147467" , "C-874467" , "C-247467" , "C-187467" , "C-247467" , "C-123954" , "C-1231589" , "C-127541" , "C-123467" , "C-123524" , "C-123687" , "C-123524" , "C-123987" , "C-123524" , "C-123984" , "C-123478" , "C-123324" ,  "R-1337" , "R-1267" , "R-1467" , "R-1267" , "R-3467" , "R-1467" , "R-1867" , "R-1237" , "R-1467" , "R-3484" , "R-3637" , "R-1767" , "R-1367" , "R-1847" , "R-9654" , "R-7437" , "R-1248" , "R-1547" , "R-1267" , "R-3697" , "R-1267" , "R-2467" , "R-6467" , "R-1477" , "R-8467" , "R-2467" , "R-1467" , "R-2467" , "R-1254" , "R-1289" , "R-1271" , "R-1237" , "R-1234" , "R-1237" , "R-1524" , "R-1287" , "R-1524" , "R-1234" , "R-1478" , "R-1233" 
    ];
	
	 var source = [
        "call" , "elctrnc"
	];

 	 var caseType =  [
        "Intake" , "Lead" , "TA" , "Cybertip" , "ERU" , "FA" , "NFA" , "LIM" , "Le5779ad", "UNID", "DEC", "UMR", "RCST", "ATT"
	];
	
	 var caseStatus =  [
        "Active" , "Resolved" 
	];
	 var numVictims =  [
        "1" , "2" , "3", "4"
	];
	var endangerment =  [
        "Yes" , "No"
	];
	var alerts =  [
        "Critical" , "Hold-over", "AMBER"
	];
	var state =  [
          "AL", "AK",  "AZ", "AR", "CA", "CO",  "CT",  "DE", "DC",  "FL", "GA", "GU",  "HI",  "ID", "IL",  "IN",  "IA", "KS",  "KY", "LA", "ME", "MD", "MA",  "MI",  "MN",  "MS", "MO", "MT", "NE", "NV",  "NH",  "NJ", "NM", "NY", "NC", "ND", "MP",  "OH", "OK", "OR", "PA",  "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT",  "VI", "VA", "WA", "WV", "WI", "WY"
  
	];
	var division =  [
          "MCD", "CAD",  "FAD", "Legal", "Team Adam", "etc."
	];

	 var assignee =
    [
         "Hala Shakhsheer", "Hung Nguyen", "Heather Treski", "Ballu Chegu", "Dave Omondi", "Andrey Pronyaev", "Brian Pipa", "Ludwig Jablonski"
    ];

    for (var i = 0; i < rowscount; i++) {
        var row = {};

        row["cases"] = cases[Math.floor(Math.random() * cases.length)];
		
		var receivedDate = new Date();
        receivedDate.setFullYear( 2010 + Math.round(Math.random() * 5) , Math.floor(Math.random() * 11), Math.floor(Math.random() * 27));
        row["receivedDate"] = receivedDate;
		
		var incidentDate = new Date();
        incidentDate.setFullYear( 2005 + Math.round(Math.random() * 5) , Math.floor(Math.random() * 11), Math.floor(Math.random() * 27));
        row["incidentDate"] = incidentDate;
		
		row["source"] 		= source[Math.floor(Math.random() * source.length)];
		row["caseType"]		= caseType[Math.floor(Math.random() * caseType.length)];
		row["caseStatus"]	= caseStatus[Math.floor(Math.random() * caseStatus.length)];
		row["numVictims"]	= numVictims[Math.floor(Math.random() * numVictims.length)];
		row["endangerment"]	= endangerment[Math.floor(Math.random() * endangerment.length)];
		row["alerts"]		= alerts[Math.floor(Math.random() * alerts.length)];
		row["state"]		= state[Math.floor(Math.random() * state.length)];
		row["division"]		= division[Math.floor(Math.random() * division.length)];
		row["assignee"]		= assignee[Math.floor(Math.random() * assignee.length)];
		row["seen"] = false;

        data[i] = row;
    }

    return data;
}

// GENERIC DATA ////////////////////////////////////////////////////////////////////////////////////////////////
function generatedata(rowscount, hasNullValues) {
    // prepare the data
    var data = new Array();
    if (rowscount == undefined) rowscount = 100;
    var firstNames =
    [
        "Andrew", "Nancy", "Shelley", "Regina", "Yoshi", "Antoni", "Mayumi", "Ian", "Peter", "Lars", "Petra", "Martin", "Sven", "Elio", "Beate", "Cheryl", "Michael", "Guylene"
    ];

    var lastNames =
    [
        "Fuller", "Davolio", "Burke", "Murphy", "Nagase", "Saavedra", "Ohno", "Devling", "Wilson", "Peterson", "Winkler", "Bein", "Petersen", "Rossi", "Vileid", "Saylor", "Bjorn", "Nodier"
    ];

    var productNames =
    [
        "Black Tea", "Green Tea", "Caffe Espresso", "Doubleshot Espresso", "Caffe Latte", "White Chocolate Mocha", "Caramel Latte", "Caffe Americano", "Cappuccino", "Espresso Truffle", "Espresso con Panna", "Peppermint Mocha Twist"
    ];

    var priceValues =
    [
         "2.25", "1.5", "3.0", "3.3", "4.5", "3.6", "3.8", "2.5", "5.0", "1.75", "3.25", "4.0"
    ];

    for (var i = 0; i < rowscount; i++) {
        var row = {};
        var productindex = Math.floor(Math.random() * productNames.length);
        var price = parseFloat(priceValues[productindex]);
        var quantity = 1 + Math.round(Math.random() * 10);

        row["id"] = i;
        row["reportsto"] = Math.floor(Math.random() * firstNames.length);
        if (i % Math.floor(Math.random() * firstNames.length) === 0) {
            row["reportsto"] = null;
        }

        row["available"] = productindex % 2 == 0;
        if (hasNullValues == true) {
            if (productindex % 2 != 0) {
                var random = Math.floor(Math.random() * rowscount);
                row["available"] = i % random == 0 ? null : false;
            }
        }
        row["firstname"] = firstNames[Math.floor(Math.random() * firstNames.length)];
        row["lastname"] = lastNames[Math.floor(Math.random() * lastNames.length)];
        row["name"] = row["firstname"] + " " + row["lastname"]; 
        row["productname"] = productNames[productindex];
        row["price"] = price;
        row["quantity"] = quantity;
        row["total"] = price * quantity;

        var date = new Date();
        date.setFullYear(2014, Math.floor(Math.random() * 11), Math.floor(Math.random() * 27));
        date.setHours(0, 0, 0, 0);
        row["date"] = date;
       
        data[i] = row;
    }

    return data;
}
function generateordersdata(rowscount) {
    // prepare the data
    var data = new Array();
    if (rowscount == undefined) rowscount = 10;
    var firstNames =
    [
        "Andrew", "Nancy", "Shelley", "Regina", "Yoshi", "Antoni", "Mayumi", "Ian", "Peter", "Lars", "Petra", "Martin", "Sven", "Elio", "Beate", "Cheryl", "Michael", "Guylene"
    ];

    var lastNames =
    [
        "Fuller", "Davolio", "Burke", "Murphy", "Nagase", "Saavedra", "Ohno", "Devling", "Wilson", "Peterson", "Winkler", "Bein", "Petersen", "Rossi", "Vileid", "Saylor", "Bjorn", "Nodier"
    ];

    var productNames =
    [
        "Black Tea", "Green Tea", "Caffe Espresso", "Doubleshot Espresso", "Caffe Latte", "White Chocolate Mocha", "Caramel Latte", "Caffe Americano", "Cappuccino", "Espresso Truffle", "Espresso con Panna", "Peppermint Mocha Twist"
    ];

    var priceValues =
    [
         "2.25", "1.5", "3.0", "3.3", "4.5", "3.6", "3.8", "2.5", "5.0", "1.75", "3.25", "4.0"
    ];

    var companyNames = ["Dolor Foundation", "Vivamus Non Lorem LLP", "Vel Ltd", "Turpis Incorporated", "Egestas Nunc PC", "At Pretium Aliquet Associates", "Feugiat Inc.", "Lacus Industries", "Senectus Et Foundation", "Sed LLC", "Maecenas Mi Felis LLC", "Pede Blandit Ltd", "Pellentesque Habitant Morbi Institute"
		, "Mollis Vitae Industries", "Malesuada Vel Convallis LLP", "Risus Duis Corp.", "Convallis LLP", "Lobortis Augue LLC", "Auctor LLP", "Neque Inc.", "Lorem Eu Corporation"];
		
    for (var i = 0; i < rowscount; i++) {
        var row = {};
        var productindex = Math.floor(Math.random() * productNames.length);
        var price = parseFloat(priceValues[productindex]);
        var quantity = 2 + Math.round(Math.random() * 10);
       
        row["id"] = i;
        row["parentid"] = null;
        row["name"] = "Order " + i;
        row["firstname"] = firstNames[Math.floor(Math.random() * firstNames.length)];
        row["lastname"] = lastNames[Math.floor(Math.random() * lastNames.length)];
        row["customer"] = companyNames[Math.floor(Math.random() * companyNames.length)];
        var date = new Date();
        var month = Math.floor(Math.random() * 11);
        var day = Math.floor(Math.random() * 27);
        date.setFullYear(2014, month, day);
        date.setHours(0, 0, 0, 0);
        row["date"] = date;
        row["price"] = "";
        row["quantity"] = "";
        data.push(row);

        var subRowsCount = 1+Math.round(Math.random() * 8);
        var t = 0;
        var q = 0;
        for (var j = 0; j < subRowsCount; j++) {
            var subRow = {};
            var productindex = Math.floor(Math.random() * productNames.length);
            var price = parseFloat(priceValues[productindex]);
            var quantity = 1;
            subRow["name"] = productNames[productindex];
            subRow["id"] = "" + i + "." + (1 + j);
            subRow["parentid"] = i;
            subRow["price"] = price;
            subRow["quantity"] = 1;
            var date = new Date();
            date.setFullYear(2014, month, day);
            date.setHours(Math.floor(Math.random() * 23), Math.floor(Math.random() * 59), 0, 0);
            subRow["date"] = date;
            row["firstname"] = firstNames[Math.floor(Math.random() * firstNames.length)];
            row["lastname"] = lastNames[Math.floor(Math.random() * lastNames.length)];
            subRow["customer"] = row["firstname"] + " " + row["lastname"];
            t += quantity * price;
            data.push(subRow);
            q += quantity;
        }
        row["price"] = t;
        row["quantity"] = 1;
    }

    return data;
}
function generatecarsdata() {
    var makes = [{ value:"", label: "Any"}, 
       {value:"140", label: "Abarth"},      
       {value:"375", label: "Acura"},      
       {value:"800", label: "Aixam"},      
       {value:"900", label: "Alfa Romeo"},      
       {value:"1100", label: "Alpina"},      
       {value:"121", label: "Artega"},      
       {value:"1750", label: "Asia Motors"},      
       {value:"1700", label: "Aston Martin"},      
       {value:"1900", label: "Audi"},      
       {value:"2000", label: "Austin"},      
       {value:"1950", label: "Austin Healey"},      
       {value:"3100", label: "Bentley"},      
       {value:"3500", label: "BMW"},      
       {value:"3850", label: "Borgward"},      
       {value:"4025", label: "Brilliance"},      
       {value:"4350", label: "Bugatti"},      
       {value:"4400", label: "Buick"},      
       {value:"4700", label: "Cadillac"},      
       {value:"112", label: "Casalini"},      
       {value:"5300", label: "Caterham"},      
       {value:"5600", label: "Chevrolet"},      
       {value:"5700", label: "Chrysler"},      
       {value:"5900", label: "Citroën"},      
       {value:"6200", label: "Cobra"},      
       {value:"6325", label: "Corvette"},      
       {value:"6600", label: "Dacia"},      
       {value:"6800", label: "Daewoo"},      
       {value:"7000", label: "Daihatsu"},      
       {value:"7400", label: "DeTomaso"},      
       {value:"7700", label: "Dodge"},      
       {value:"8600", label: "Ferrari"},      
       {value:"8800", label: "Fiat"},      
       {value:"172", label: "Fisker"},      
       {value:"9000", label: "Ford"},      
       {value:"9900", label: "GMC"},      
       {value:"122", label: "Grecav"},      
       {value:"10850", label: "Holden"},      
       {value:"11000", label: "Honda"},      
       {value:"11050", label: "Hummer"},      
       {value:"11600", label: "Hyundai"},      
       {value:"11650", label: "Infiniti"},      
       {value:"11900", label: "Isuzu"},      
       {value:"12100", label: "Iveco"},      
       {value:"12400", label: "Jaguar"},      
       {value:"12600", label: "Jeep"},      
       {value:"13200", label: "Kia"},      
       {value:"13450", label: "Königsegg"},      
       {value:"13900", label: "KTM"},      
       {value:"14400", label: "Lada"},      
       {value:"14600", label: "Lamborghini"},      
       {value:"14700", label: "Lancia"},      
       {value:"14800", label: "Land Rover"},      
       {value:"14845", label: "Landwind"},      
       {value:"15200", label: "Lexus"},      
       {value:"15400", label: "Ligier"},      
       {value:"15500", label: "Lincoln"},      
       {value:"15900", label: "Lotus"},      
       {value:"16200", label: "Mahindra"},      
       {value:"16600", label: "Maserati"},      
       {value:"16700", label: "Maybach"},      
       {value:"16800", label: "Mazda"},      
       {value:"137", label: "McLaren"},      
       {value:"17200", label: "Mercedes-Benz"},      
       {value:"17300", label: "MG"},      
       {value:"30011", label: "Microcar"},      
       {value:"17500", label: "MINI"},      
       {value:"17700", label: "Mitsubishi"},      
       {value:"17900", label: "Morgan"},      
       {value:"18700", label: "Nissan"},      
       {value:"18875", label: "NSU"},      
       {value:"18975", label: "Oldsmobile"},      
       {value:"19000", label: "Opel"},      
       {value:"149", label: "Pagani"},      
       {value:"19300", label: "Peugeot"},      
       {value:"19600", label: "Piaggio"},      
       {value:"19800", label: "Plymouth"},      
       {value:"20000", label: "Pontiac"},      
       {value:"20100", label: "Porsche"},      
       {value:"20200", label: "Proton"},      
       {value:"20700", label: "Renault"},      
       {value:"21600", label: "Rolls Royce"},      
       {value:"21700", label: "Rover"},      
       {value:"125", label: "Ruf"},      
       {value:"21800", label: "Saab"},      
       {value:"22000", label: "Santana"},      
       {value:"22500", label: "Seat"},      
       {value:"22900", label: "Skoda"},      
       {value:"23000", label: "Smart"},      
       {value:"100", label: "Spyker"},      
       {value:"23100", label: "Ssangyong"},      
       {value:"23500", label: "Subaru"},      
       {value:"23600", label: "Suzuki"},      
       {value:"23800", label: "Talbot"},      
       {value:"23825", label: "Tata"},      
       {value:"135", label: "Tesla"},      
       {value:"24100", label: "Toyota"},      
       {value:"24200", label: "Trabant"},      
       {value:"24400", label: "Triumph"},      
       {value:"24500", label: "TVR"},      
       {value:"25200", label: "Volkswagen"},      
       {value:"25100", label: "Volvo"},      
       {value:"25300", label: "Wartburg"},      
       {value:"113", label: "Westfield"},      
       { value: "25650", label: "Wiesmann" }];

    var fuelType = ["Any", "Diesel", "Electric", "Ethanol (FFV, E85, etc.)", "Gas", "LPG", "Natural Gas", "Hybrid", "Hydrogen", "Petrol"];
    var vehicleType = ["Saloon", "Small Car", "Estate Car", "Van / Minibus", "Off-road Vehicle/Pickup Truck", "Cabriolet / Roadster", "Sports Car/Coupe"];
    var power =
    [
      {value:"24", label: "24 kW (33 PS)"},
      {value:"36", label: "36 kW (49 PS)"},
      {value:"43", label: "43 kW (58 PS)"},
      {value:"54", label: "54 kW (73 PS)"},
      {value:"65", label: "65 kW (88 PS)"},
      {value:"73", label: "73 kW (99 PS)"},
      {value:"86", label: "86 kW (117 PS)"},
      {value:"95", label: "95 kW (129 PS)"},
      {value:"109", label: "109 kW (148 PS)"},
      {value:"146", label: "146 kW (199 PS)"},
      {value:"184", label: "184 kW (250 PS)"},
      {value:"222", label: "222 kW (302 PS)"},
      {value:"262", label: "262 kW (356 PS)"},
      {value:"295", label: "295 kW (401 PS)"},
      {value:"333", label: "333 kW (453 PS)"}
    ];

    var data = new Array();
    for (var i = 0; i < makes.length; i++) {
        var row = {};
        row.make = makes[i].label;
        row.fuelType = fuelType[Math.floor(Math.random() * fuelType.length)];
        row.vehicleType = vehicleType[Math.floor(Math.random() * vehicleType.length)];
        var powerIndex = Math.floor(Math.random() * power.length);
        if (powerIndex == power.length - 1) powerIndex --;
        row.powerFrom = power[powerIndex];
        row.powerTo = power[powerIndex + 1];
        data.push(row);
    }
    return data;
}