// utils/cropImage.ts
export const getCroppedImg = (imageSrc: string, pixelCrop: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.crossOrigin = "anonymous"
      image.src = imageSrc
      image.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height
        const ctx = canvas.getContext("2d")
  
        if (!ctx) {
          return reject(new Error("Canvas context not available"))
        }
  
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        )
  
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedImageUrl = URL.createObjectURL(blob)
            resolve(croppedImageUrl)
          } else {
            reject(new Error("Canvas is empty"))
          }
        }, "image/jpeg")
      }
  
      image.onerror = (error) => {
        reject(error)
      }
    })
  }
  