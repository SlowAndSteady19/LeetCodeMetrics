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
        const totalQuestions = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQuestions = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQuestions = parsedData.data.allQuestionsCount[2].count;
        const totalHardQuestions = parsedData.data.allQuestionsCount[3].count;

        const totalSolvedQuestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const totalSolvedEasyQuestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const totalSolvedMediumQuestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const totalSolvedHardQuestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(totalSolvedEasyQuestions, totalEasyQuestions, easyLabel, easyCircle);
        updateProgress(totalSolvedMediumQuestions, totalMediumQuestions, mediumLabel, mediumCircle);
        updateProgress(totalSolvedHardQuestions, totalHardQuestions, hardLabel, hardCircle);

    }

    async function fetchUserDetail(username){
        
        


        
        try{
            searchButton.textContent="Searching....";
            searchButton.disabled=true;
            // let response = await fetch(url);
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const targetUrl = 'https://leetcode.com/graphql/';
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: `
                  query userSessionProgress($username: String!) {
                    allQuestionsCount {
                      difficulty
                      count
                    }
                    matchedUser(username: $username) {
                      submitStats {
                        acSubmissionNum {
                          difficulty
                          count
                          submissions
                        }
                        totalSubmissionNum {
                          difficulty
                          count
                          submissions
                        }
                      }
                    }
                  }
                `,
                variables: {
                  username: username
                }
            });

            const requestOptions = {
                method: "POST", 
                headers: myHeaders,
                body: graphql,
                redirect: "follow"
            };

            const response = await fetch(proxyUrl+targetUrl, requestOptions);
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