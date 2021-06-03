
const parseLi = (para) => {
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

const getCookingDetails = (inst) => {
    let finalParams = {
        preheat: false,
        temp: 0,
        time: 0,
        bake: false
    }
    inst.forEach(i => {
        const para = [...i.querySelectorAll("li")]
        let res = parseLi(para)
        finalParams.preheat = finalParams.preheat || res.preheat
        finalParams.bake = finalParams.bake || res.bake
        finalParams.temp = Math.max(finalParams.temp, res.temp)
        finalParams.time = Math.max(finalParams.time, res.time)
    })
    return finalParams
}

export default getCookingDetails