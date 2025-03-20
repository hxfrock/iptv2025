function main(item) {
    // 获取 URL 参数
    const url = item.url;
    const channel_id = ku9.getQuery(url, "channel-id");
    const Contentid = ku9.getQuery(url, "Contentid");
    const playseek = ku9.getQuery(url, "playseek") || null;
    //const np = ku9.getQuery(url, "np") || "";

    // 验证必填参数
    if (!channel_id || !Contentid) {
        return { error: "缺少必传参数: channel-id 或 Contentid" };
    }
    
    response = ku9.get("http://119.29.29.29/d?dn=itv.dns.52top.com.cn");
    np = response.split(";")[0];     
    if (np=="")  np="39.135.97.83";
    let finalUrl;

    // 处理回看（playseek 需要转换时间格式）
    if (playseek) {
        let t_arr = playseek.replace(/-/g, ".0").concat(".0").match(/.{8}/g);
        if (t_arr.length >= 4) {
            let starttime = `${t_arr[0]}T${t_arr[1]}0Z`;
            let endtime = `${t_arr[2]}T${t_arr[3]}0Z`;
            finalUrl = `http://gslbserv.itv.cmvideo.cn/index.m3u8?channel-id=${channel_id}&Contentid=${Contentid}&livemode=4&stbId=hxf&starttime=${starttime}&endtime=${endtime}`;
        } else {
            return { error: "playseek 格式错误" };
        }
    } else {
        // 处理直播
        finalUrl = `http://gslbserv.itv.cmvideo.cn/index.m3u8?channel-id=${channel_id}&Contentid=${Contentid}&livemode=1&stbId=hxf`;
    }

    let hosts = {
        "cache.ott.fifalive.itv.cmvideo.cn": np,
        "cache.ott.bestlive.itv.cmvideo.cn": np,
        "cache.ott.ystenlive.itv.cmvideo.cn": np,
        "cache.ott.wasulive.itv.cmvideo.cn": np,
        "cache.ott.hnbblive.itv.cmvideo.cn": np
    };

    return { url: finalUrl, host: hosts };
}
