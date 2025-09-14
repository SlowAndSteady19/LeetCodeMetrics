document.addEventListener("DOMContentLoaded", function(){
    const searchButton = document.getElementById("buttonid");
    const usernameInput = document.getElementById("inputid");
    const statsContainer = document.querySelector(".stats");
    const easyCircle = document.querySelector(".easy");
    const mediumCircle = document.querySelector(".medium");
    const hardCircle = document.querySelector(".hard");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardsStatsContainer = document.querySelector(".statscard");
    

    //return true or false whether the username is valid or not
    function validateUsername(username){
        if(username.trim()===""){
            alert("Username is not valid");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Invalid username"); 
        }
        return isMatching;
    }
    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }
    function displayUserData(parsedData){
        // const totalQuestions = parsedData.data.allQuestionsCount[0].count;
        // const totalEasyQuestions = parsedData.data.allQuestionsCount[1].count;
        // const totalMediumQuestions = parsedData.data.allQuestionsCount[2].count;
        // const totalHardQuestions = parsedData.data.allQuestionsCount[3].count;

        // const totalSolvedQuestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        // const totalSolvedEasyQuestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        // const totalSolvedMediumQuestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        // const totalSolvedHardQuestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        const totalQuestions = parsedData.totalQuestions;
        const totalEasyQuestions = parsedData.totalEasy;
        const totalMediumQuestions = parsedData.totalMedium;
        const totalHardQuestions = parsedData.totalHard;
    
        const totalSolvedQuestions = parsedData.totalSolved;
        const totalSolvedEasyQuestions = parsedData.easySolved;
        const totalSolvedMediumQuestions = parsedData.mediumSolved;
        const totalSolvedHardQuestions = parsedData.hardSolved;
        
        updateProgress(totalSolvedEasyQuestions, totalEasyQuestions, easyLabel, easyCircle);
        updateProgress(totalSolvedMediumQuestions, totalMediumQuestions, mediumLabel, mediumCircle);
        updateProgress(totalSolvedHardQuestions, totalHardQuestions, hardLabel, hardCircle);

        const cardsData = [
        { label: "Total Solved", value: totalSolvedQuestions },
        { label: "Acceptance Rate", value: parsedData.acceptanceRate + "%" },
        { label: "Ranking", value: parsedData.ranking }
        
        ];

        cardsStatsContainer.innerHTML = cardsData.map(
            data => {
                return `
                <div class="card">
                   <h3>${data.label}</h3>
                   <p>${data.value}</p>
                </div>
                `;
            }
        ).join("");

    }

    async function fetchUserDetail(username){
        
        


        
        try{
            searchButton.textContent="Searching....";
            searchButton.disabled=true;
            // let response = await fetch(url);
            const proxyUrl = 'https://thingproxy.freeboard.io/fetch/';
            const targetUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
            // const myHeaders = new Headers();
            // myHeaders.append("content-type", "application/json");

            // const graphql = JSON.stringify({
            //     query: `
            //       query userSessionProgress($username: String!) {
            //         allQuestionsCount {
            //           difficulty
            //           count
            //         }
            //         matchedUser(username: $username) {
            //           submitStats {
            //             acSubmissionNum {
            //               difficulty
            //               count
            //               submissions
            //             }
            //             totalSubmissionNum {
            //               difficulty
            //               count
            //               submissions
            //             }
            //           }
            //         }
            //       }
            //     `,
            //     variables: {
            //       username: username
            //     }
            // });

            // const requestOptions = {
            //     method: "POST", 
            //     headers: myHeaders,
            //     body: graphql,
            //     redirect: "follow"
            // };

            const response = await fetch(targetUrl);
            if(!response.ok){
                throw new Error("Enable to fetch the user details");
            }
            const parsedData = await  response.json();
            console.log("Loggin data: ", parsedData);
            displayUserData(parsedData);
        }
        catch(err){
            console.error(err);
            alert("Error fetching user data");
        }
        finally
        {
            searchButton.textContent="Calculate";
            searchButton.disabled=false;
        }
    }
    searchButton.addEventListener('click', function(){
        const username = usernameInput.value;
       
        if(validateUsername(username)){
            fetchUserDetail(username);
        }
    })


})