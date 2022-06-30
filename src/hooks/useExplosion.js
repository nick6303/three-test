import * as THREE from 'three'

function useExplosion(scene, creeperObj) {
  // 變數宣告
  const pointCount = 1000 // 粒子總數
  const movementSpeed = 10 // 移速種子
  let explosion = [] // 爆炸物件
  let size = 10 // 粒子尺寸
  const smoke = require('@img/smoke.png')
  const smokeTexture = new THREE.TextureLoader().load(smoke)

  // 爆炸類別
  class Explosion {
    constructor(x, y, z, color) {
      // 幾何體
      const geometry = new THREE.BufferGeometry()

      // 材質
      this.material = new THREE.PointsMaterial({
        size: size,
        color: color,
        map: smokeTexture,
        blending: THREE.CustomBlending,
        depthTest: false,
        transparent: true,
        opacity: 0.7,
      })

      this.pCount = pointCount
      this.movementSpeed = movementSpeed
      this.dirs = []
      this.positions = []

      // 建立粒子系統所需頂點
      for (let i = 0; i < this.pCount; i++) {
        this.positions.push(x, y, z)
        const r = this.movementSpeed * THREE.Math.randFloat(0, 1)
        // 噴射方向隨機 -> 不規則球體
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        this.dirs.push({
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.sin(phi) * Math.sin(theta),
          z: r * Math.cos(phi),
        })
      }

      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(this.positions, 3)
      )

      let points = new THREE.Points(geometry, this.material)

      this.object = points

      scene.add(this.object)
    }
    update() {
      let p = this.pCount
      const d = this.dirs
      const positions = this.object.geometry.attributes.position.array
      while (p--) {
        positions[3 * p] += d[p].x
        positions[3 * p + 1] += d[p].y
        positions[3 * p + 2] += d[p].z
      }
      this.object.geometry.attributes.position.needsUpdate = true
    }
    destroy() {
      this.object.geometry.dispose()
      scene.remove(this.object)
      this.dirs.length = 0
    }
  }

  const explosionTrigger = function () {
    for (let i = 0; i < scene.children.length; i++) {
      const object = scene.children[i]

      // 場景內有苦力怕才爆炸
      if (object.name === 'creeper') {
        // 清除之前爆炸粒子
        if (explosion) {
          const len = explosion.length
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              explosion[i].destroy()
            }
          }
          explosion.length = 0
        }
        // 移除苦力怕
        scene.remove(creeperObj.creeper)

        // 產生爆炸
        explosion[0] = new Explosion(0, 0, 0, 0x000000)
        explosion[1] = new Explosion(5, 5, 5, 0x333333)
        explosion[2] = new Explosion(-5, 5, 10, 0x666666)
        explosion[3] = new Explosion(-5, 5, 5, 0x999999)
        explosion[4] = new Explosion(5, 5, -5, 0xcccccc)
      }
    }
  }

  const resetCreeper = function () {
    scene.add(creeperObj.creeper)
  }

  return {
    explosionTrigger,
    resetCreeper,
    explosion,
  }
}

export default useExplosion
