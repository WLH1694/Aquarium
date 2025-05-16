class Vector {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }

    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }

    sub(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    }

    mult(n) {
      this.x = n;
      this.y= n;
      return this;
    }

    div(n) {
      if (n !== 0) {
        this.x /= n;
        this.y /= n;
      }
      return this;
    }

    mag() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    setMag(n) {
      return this.normalize().mult(n);
    }

    normalize() {
      let m = this.mag();
      if (m !== 0) {
        this.div(m);
      }
      return this;
    }

    copy() {
      return new Vector(this.x, this.y);
    }

    dist(v) {
      return Vector.dist(this, v);
    }

    static sub(v1, v2) {
      return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static dist(v1, v2) {
      let dx = v1.x - v2.x;
      let dy = v1.y - v2.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }