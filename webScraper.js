
export const parseLi = (para, url) => {
    var params = {
        preheat: false,
        temp: 0,
        time: 0,
        bake: false
    }
    para.forEach(p => {
        var text = p.textContent
        var mins = text.match(/\d+\**\s*min/i)
        if (text.match(/bake/i)) {
            params.bake = true
            if (mins) {
                params.time = parseInt(mins[0].match(/\d+/)[0]);
            }
        }
        if (text.match(/preheat/i)) {
            params.preheat = true

            if (url.includes("delish")) {
                var resF = text.match(/\d+.*º/)
                if (resF) {
                    var f = parseInt(resF[0].match(/\d+/)[0])
                    if (f > 200 && f < 500) params.temp = Math.round((f - 32) * (5 / 9))
                }
            } else {
                var resF = text.match(/\d+.*F/)
                if (resF) {
                    var f = parseInt(resF[0].match(/\d+/)[0])
                    if (f > 200 && f < 500) params.temp = Math.round((f - 32) * (5 / 9))
                }
                else {
                    var resC = text.match(/\d+.*C/)
                    if (resC) {
                        var c = parseInt(resC[0].match(/\d+/)[0])
                        if (c >= 100 && c <= 280) params.temp = c
                    }
                }
            }
        }
    })
    return params
}

export const getCookingDetails = (inst, url) => {
    let finalParams = {
        preheat: false,
        temp: 0,
        time: 0,
        bake: false
    }
    inst._toArray().forEach(i => {
        const para = [...i.querySelectorAll("li")._toArray()]
        let res = parseLi(para, url)
        finalParams.preheat = finalParams.preheat || res.preheat
        finalParams.bake = finalParams.bake || res.bake
        finalParams.temp = Math.max(finalParams.temp, res.temp)
        finalParams.time = Math.max(finalParams.time, res.time)
    })
    return finalParams


}

export const getInstructionClass = (url) => {
    if (url.includes("allrecipes"))
        return ".instructions-section"
    else if (url.includes("sallysbaking") || url.includes("gimmesomeoven"))
        return ".tasty-recipes-instructions-body"
    else if (url.includes("recipetineats"))
        return ".wprm-recipe-instructions"
    else if (url.includes("delish"))
        return ".direction-lists"
    else if (url.includes("indianhealthyrecipes") || url.includes("vegrecipesofindia"))
        return ".wprm-recipe-instructions"
    else return
}

export const isAcceptedURL = (url) => {
    var acceptedURLs = ["allrecipes", "sallysbaking", "gimmesomeoven", "recipetineats", "delish", "indianhealthyrecipes", "vegrecipesofindia"]
    return acceptedURLs.some(el => url.includes(el))
}