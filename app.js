import { postsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'post-btn'){
        handlePostBtnClick()
    }
    else if(e.target.id === 'replay-btn'){
        let replyInput = ''
        document.querySelectorAll('.reply-value').forEach(function(item){
            if(item.value){
                replyInput = item.value
            }
        })
        handleReplayBtnClick(e.target.dataset.replyText,replyInput)
    }
})
 
function handleLikeClick(postId){ 
    const targetTweetObj = postsData.filter(function(post){
        return post.uuid === postId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(postId){
    const targetTweetObj = postsData.filter(function(post){
        return post.uuid === postId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handlePostBtnClick(){
    const postInput = document.getElementById('post-input')

    if(postInput.value){
        postsData.unshift({
            handle: `@newUser`,
            profilePic: `images/newUser.png`,
            likes: 0,
            retweets: 0,
            tweetText: postInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid:uuidv4()
        })
    render()
    postInput.value = ''
    }

}

function handleReplayBtnClick(replyuuid, replayvalue){

    const targetreplyObj = postsData.filter(function(post){
        return post.uuid === replyuuid
    })[0]

    if(replayvalue){
        targetreplyObj.replies.unshift({
            handle: `@newUser`,
            profilePic: `images/newUser.png`,
            tweetText: replayvalue,
        })
        render()
        replayvalue = ''
    }

}
function getFeedHtml(){
    let feedHtml = ``
    
    postsData.forEach(function(post){
        
        let likeIconClass = ''
        
        if (post.isLiked){
            likeIconClass = 'liked'
        }
        
        let rePostIconClass = ''
        
        if (post.isRetweeted){
            rePostIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(post.replies.length > 0){
            post.replies.forEach(function(reply){
                repliesHtml+=`
                                <div class="post-reply">
                                    <div class="post-inner">
                                        <img src="${reply.profilePic}" class="today-pic">
                                            <div>
                                                <p class="handle">${reply.handle}</p>
                                                <p class="post-text">${reply.tweetText}</p>
                                            </div>
                                        </div>
                                </div>
                                `
            })
        }
        
          
        feedHtml += `
                    <div class="post">
                        <div class="post-inner">
                            <img src="${post.profilePic}" class="today-pic">
                            <div>
                                <p class="handle">${post.handle}</p>
                                <p class="post-text">${post.tweetText}</p>
                                <div class="post-details">
                                    <span class="post-detail">
                                        <i class="fa-regular fa-comment-dots"
                                        data-reply="${post.uuid}"
                                        ></i>
                                        ${post.replies.length}
                                    </span>
                                    <span class="post-detail">
                                        <i class="fa-solid fa-heart ${likeIconClass}"
                                        data-like="${post.uuid}"
                                        ></i>
                                        ${post.likes}
                                    </span>
                                    <span class="post-detail">
                                        <i class="fa-solid fa-retweet ${rePostIconClass}"
                                        data-retweet="${post.uuid}"
                                        ></i>
                                        ${post.retweets}
                                    </span>
                                </div>   
                            </div>            
                        </div>
                        <div class="hidden" id="replies-${post.uuid}">
                            ${repliesHtml}
                            <div class="replay-input">
                                <img src="images/icons8-send-50.png" class="today-pic" >
                                <textarea placeholder="#replay" class="reply-value"></textarea>
                                <button id="replay-btn" data-reply-text="${post.uuid}">Post</button>
                            </div>
                        </div>   
                    </div>
                    `
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()