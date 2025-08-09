export const Utils = {
    getAllUrl(list, prefix) {
        const urls = []
        list.forEach((item) => {
            delete item.key
            urls.push(...this.getDeepStr(item))
        })
        if (prefix.length) return urls.map((str) => `${prefix}${str}`)
        return urls
    },
    getDeepStr(obj) {
        const arr = []
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === 'string') {
                arr.push(obj[key])
            } else {
                arr.push(...this.getDeepStr(obj[key]))
            }
        })
        return arr
    },
    loadAsset(loader, url) {
        const suffix = url.split('.').pop()
        switch (suffix) {
            case 'png':
            case 'jpg': {
                loader.loadTexture(url)
                break
            }
            case 'atlas':
            case 'json': {
                loader.loadText(url)
                break
            }
            case 'skel': {
                loader.loadBinary(url)
                break
            }
        }
    },
}
