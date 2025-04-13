function isAd(tweet) {
    return [...tweet.querySelectorAll('span')].some(span => span.textContent.trim() === 'Ad');
}

function removeAds() {
    // X
    document.querySelectorAll('article[data-testid="tweet"]').forEach(article => {
        if (isAd(article)) {
            const nameSpan = article.querySelector('[data-testid="User-Name"] span');
            const handleSpan = [...article.querySelectorAll('span')].find(span => span.textContent.trim().startsWith('@'));
            const img = article.querySelector('img');
            
            const username = handleSpan ? handleSpan.textContent.trim() : 'Unknown';
            const imageUrl = img ? img.src : 'No image found';
            
            const adInfo = {
                name: nameSpan ? nameSpan.textContent.trim() : 'Unknown',
                username: username,
                imageUrl: imageUrl
            };
            
//            console.log(adInfo);
            
            const cellDiv = article.closest('[data-testid="cellInnerDiv"]');
            if (cellDiv) {
                cellDiv.style.height = '0px';
                cellDiv.style.opacity = '0';
                cellDiv.style.overflow = 'hidden';
                cellDiv.style.pointerEvents = 'none';
            }
        }
    });
    
    // Reddit
    const shredditFeed = document.querySelector('shreddit-feed');
    if (shredditFeed) {
        const promotedAds = shredditFeed.querySelectorAll('.promotedlink');
        promotedAds.forEach(el => {
            el.style.height = '0px';
            el.style.opacity = '0';
            el.style.overflow = 'hidden';
            el.style.pointerEvents = 'none';
            
            const nameEl = el.querySelector('.promoted-name-container');
            const name = nameEl?.textContent?.replace(/\s+/g, '') || 'Unknown';
            console.log(`AD: Name: ${name}`);
        });
    }
    
    // LinkedIn
    const mainFeed = document.querySelector('main[aria-label="Main Feed"]');
    if (mainFeed) {
        const posts = mainFeed.querySelectorAll('[data-id]');
        posts.forEach(post => {
            const promotedSpan = [...post.querySelectorAll('span')].find(span => span.textContent.includes('Promoted'));
            if (promotedSpan) {
                const titleEl = post.querySelector('.update-components-actor__title');
                const name = titleEl ? titleEl.textContent.replace(/\s+/g, '') : 'Unknown';

                const subtitleEl = post.querySelector('.update-components-article__title');
                const adTitle = subtitleEl ? subtitleEl.textContent.trim() : 'No ad title';

                const imgEl = post.querySelector('img');
                const imageUrl = imgEl ? imgEl.src : 'No image found';

                console.log(`LinkedIn Ad: Name: ${name}, Title: ${adTitle}, Image: ${imageUrl}`);

                post.style.height = '0px';
                post.style.opacity = '0';
//                post.style.overflow = 'hidden';
                post.style.pointerEvents = 'none';
            }
        });
    }

    // LinkedIn sidebar ads
    const iframeAds = document.querySelectorAll('iframe[data-ad-banner]');
    iframeAds.forEach(iframe => {
        const title = iframe.title || 'Unknown';
        const src = iframe.src || 'No src';
        console.log(`LinkedIn Sidebar Iframe Ad: Title: ${title}, Src: ${src}`);

        iframe.style.height = '0px';
        iframe.style.opacity = '0';
        iframe.style.overflow = 'hidden';
        iframe.style.pointerEvents = 'none';
        iframe.style.border = 'none';
        iframe.style.display = 'none';
    });
}

const observer = new MutationObserver(() => {
    clearTimeout(window.__removeAdsDebounce__);
    window.__removeAdsDebounce__ = setTimeout(removeAds, 500);
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});
