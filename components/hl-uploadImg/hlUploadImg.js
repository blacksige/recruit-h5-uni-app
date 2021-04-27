const uploadPath = "http://192.168.1.234:8058/upload/doUpload/file"; //上传地址

export default {
    /**
     * @param {Object} limitNum     总数
     * @param {Object} overSize     单张大小限制
     * @param {Object} selectedNum  已有张数
     */
    selectImg: function(option) {
        return new Promise((resolve,reject) => {
            let _sizeType, _sourceType, _overSize;
            if (option.limitNum == 1) {
                _sourceType = ['album', 'camera']
            } else {
                if (option.sourceType == "album") {
                    _sourceType = ['album']
                } else if (option.sourceType == "camera") {
                    _sourceType = ['camera']
                } else {
                    _sourceType = ['album', 'camera']
                }
            }
            if (option.sizeType == 'all') {
                _sizeType = ['original', 'compressed']
            } else if (option.sizeType == 'original') {
                _sizeType = ['original']
            } else {
                _sizeType = ['compressed']
            }

            let _count = option.limitNum - option.selectedNum

            uni.chooseImage({
                count: _count,
                sizeType: _sizeType,
                sourceType: _sourceType,
                success: function(res) {
                    let _allCount = option.selectedNum + res.tempFilePaths.length;
                    if (_allCount > option.limitNum) {
                        uni.showToast({
                            title: '最多只能上传' + option.limitNum + '张照片',
                            icon: 'none'
                        });
                    } else {
                        if (option.overSize) {
                            let imgSize = res.tempFiles.every((x) => {

                                return x.size <= option.overSize
                            })
                            if (!imgSize) {
                                let _unit = '';
                                if ((option.overSize / 1024) < 1024) {
                                    _unit = option.overSize / 1024 + 'KB'
                                } else {
                                    _unit = option.overSize / (1024 * 1024) + 'MB'
                                }
                                uni.showToast({
                                    title: '图片不能超过' + _unit,
                                    icon: 'none'
                                });
                                console.error('图片大小超过限制');
                                reject({
                                    msg: '图片大小超过限制'
                                })
                                return false
                            }
                        }
                        resolve(res.tempFilePaths)

                    }

                },
                fail: (err) => {
                    console.error('选择图片失败');
                    console.error(err);
                    reject(err)
                }
            });
        })

    },
    /**
     * @description 多图上传 同步函数,第一张上传成功后才会上传后面一张
     * @param {Array} fileArray
     * @return {Array} 上传成功后返回的结果
     */
    async uploadImg(_components) {
        let _this = this;
        let result = [];
        
        for (let i = 0; i < _components.waitUploadImg.length; i++) {
            const ret = await _this.uploadSingleImg(_components.waitUploadImg[i],i,_components).then(res => {
                result[i] = res
            })

        }
        return result;
    },
    /**
     * @description 单图上传
     * @param {Object} file 文件路径
     */
    uploadSingleImg(file,index,_this) {
        return new Promise((resolve) => {
            if (file.indexOf("blob:") > -1 || file.indexOf("file:") > -1 || file.indexOf('http://tmp/') > -1) {
                const uploadTask = uni.uploadFile({
                    url: uploadPath,                
                    filePath: file,
                    name: 'file',           //可以修改为你需要的文件名
                    success: (uploadFileRes) => {
						console.log(uploadFileRes);
                        /*
                            如果你上传图片成功后的接口响应不是如下类型，请按照实际修改，确保最后只返回上传成功的URL
                            {
                                code:0,
                                msg:"sucess"
                                data:{
                                    filePath:"http://www.xxx123.com/20201119/bdf893b4255b4c7d8998b67c76f11535.png"
                                }
                            }
                        */
                        let _res=uploadFileRes.data.filePath;           //按照你的实际响应修改
                        
                        
                        _this.uploadedImages[index]=_res;
						_this.localImages[index]=_res;
                        _this.waitUploadImg[index]='';
                        _this.thisUpImg.push(_res);
						
                        resolve(_res);
                    },
					fail: (err) => {
						console.log(err);
					},
					complete:(res)=>{
						if(res.statusCode!=200){
							uni.showToast({
								title: '图片上传失败',
								icon: 'none'
							});
							uploadTask.abort();
							return false;
						}
						// console.log(res);
					}
                });

                uploadTask.onProgressUpdate((res) => {
                    _this.upProgress[index]=res.progress
                    _this.$forceUpdate()
                    
                });
            } else {
                _this.upProgress[index]=100
               _this.uploadedImages[index]=_this.localImages[index];
               _this.waitUploadImg[index]='';
               resolve(file)
            }

        })
    },
	/**
	 * @description 遍历转换对象为样式字符串
	 * @param {Object} obj
	 */
	ergodicObject(obj){
		// #ifdef MP
		let _styStr='';
		Object.keys(obj).forEach(x=>{
			_styStr+=x.replace(/([A-Z])/g,"-$1").toLowerCase()+':'+obj[x]+';';		//驼峰式命名转CSS连字符
		})
		return _styStr;
		// #endif
		// #ifndef MP
		return obj;
		// #endif
	}
}
