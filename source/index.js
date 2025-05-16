let fishList = [];
let foodList = [];
let redFoodList = [];
let greenFishSlider, yellowFishSlider, applyButton;

function setup() {
  createCanvas(800, 600);
  createP("Antal grønne fisk (1–100):");
  greenFishSlider = createSlider(1, 100, 10, 1);

  createP("Antal gule fisk (0–40):");
  yellowFishSlider = createSlider(0, 40, 2, 1);

  applyButton = createButton("Anvend antal fisk");
  applyButton.mousePressed(applyFishCount);

  applyFishCount();
}

function draw() {
  background(50, 150, 200);

  for (let food of foodList) food.show();
  for (let food of redFoodList) food.show();

  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    if (keyIsDown(49)) foodList.push(new Food(mouseX, mouseY));
    if (keyIsDown(50)) redFoodList.push(new RedFood(mouseX, mouseY));
  }

  for (let fish of fishList) {
    fish.move(foodList, redFoodList, fishList);
    fish.show();
  }

  foodList = foodList.filter(f => !f.eaten);
  redFoodList = redFoodList.filter(f => !f.eaten);
}

function applyFishCount() {
  fishList = [];
  for (let i = 0; i < greenFishSlider.value(); i++) fishList.push(new FishTypeA(random(width), random(height)));
  for (let i = 0; i < yellowFishSlider.value(); i++) fishList.push(new FishTypeB(random(width), random(height)));
}

class Fish {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.size = 15;
    this.speed = 1.5;
  }

  avoidOtherFish(fishList) {
    let steer = new Vector(0, 0);
    let count = 0;

    for (let other of fishList) {
      if (other !== this) {
        let d = Vector.dist(this.pos, other.pos);
        if (d < 30) {
          let diff = Vector.sub(this.pos, other.pos);
          diff.mult(5/d)
          steer.add(diff);
          count++;
        }
      }
    }

    if (count > 0) {
      steer.div(count);
      steer.setMag(0.5);
      this.pos.add(steer);
    }

    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }

  show() {
    ellipse(this.pos.x, this.pos.y, this.size, this.size / 2);
    triangle(
      this.pos.x - this.size / 2, this.pos.y,
      this.pos.x - this.size, this.pos.y - 5,
      this.pos.x - this.size, this.pos.y + 5
    );
  }
}

class FishTypeA extends Fish {
  constructor(x, y) {
    super(x, y);
    this.color = color(100, 255, 100);
    this.speed = 1.5;
  }

  move(foodList, redFoodList, fishList) {
    this.seek(foodList);
    this.avoidOtherFish(fishList);
  }

  seek(foodList) {
    if (foodList.length === 0) return;

    let closest = null;
    let minDist = Infinity;

    for (let food of foodList) {
      let d = Vector.dist(this.pos, food);
      if (d < minDist) {
        minDist = d;
        closest = food;
      }
    }

    if (closest) {
      let dir = new Vector(closest.x - this.pos.x, closest.y - this.pos.y).setMag(this.speed);
      this.pos.add(dir);
      if (minDist < 10) closest.eaten = true;
    }

    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }

  show() {
    fill(this.color);
    super.show();
  }
}

class FishTypeB extends Fish {
  constructor(x, y) {
    super(x, y);
    this.color = color(255, 255, 0);
    this.speed = 2.8;
  }

  move(foodList, redFoodList, fishList) {
    this.seek(redFoodList);
    this.avoidOtherFish(fishList);
  }

  seek(redFoodList) {
    if (redFoodList.length === 0) return;

    let closest = null;
    let minDist = Infinity;

    for (let food of redFoodList) {
      let d = Vector.dist(this.pos, food);
      if (d < minDist) {
        minDist = d;
        closest = food;
      }
    }

    if (closest) {
      let dir = new Vector(closest.x - this.pos.x, closest.y - this.pos.y).setMag(this.speed);
      this.pos.add(dir);
      if (minDist < 10) closest.eaten = true;
    }

    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }

  show() {
    fill(this.color);
    super.show();
  }
}

class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.eaten = false;
  }

  show() {
    if (!this.eaten) {
      fill(255, 255, 0);
      ellipse(this.x, this.y, 10);
    }
  }
}

class RedFood {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.eaten = false;
  }

  show() {
    if (!this.eaten) {
      fill(255, 50, 50);
      rect(this.x - 5, this.y - 5, 10, 10);
    }
  }
}