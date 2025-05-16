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

  // Vis mad
  for (let food of foodList) food.show();
  for (let food of redFoodList) food.show();

  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    if (keyIsDown(49)) foodList.push(new Food(mouseX, mouseY));
    if (keyIsDown(50)) redFoodList.push(new RedFood(mouseX, mouseY));
  }

  // Fisk logik
  for (let fish of fishList) {
    fish.move(foodList, redFoodList);
    fish.show();
  }

  // Fjern spist mad
  foodList = foodList.filter(f => !f.eaten);
  redFoodList = redFoodList.filter(f => !f.eaten);
}

function applyFishCount() {
  fishList = [];
  for (let i = 0; i < greenFishSlider.value(); i++) {
    fishList.push(new FishTypeA(random(width), random(height)));
  }
  for (let i = 0; i < yellowFishSlider.value(); i++) {
    fishList.push(new FishTypeB(random(width), random(height)));
  }
}

// Hjælpefunktion til glidende vinkler
function lerpAngle(a, b, t) {
  let diff = b - a;
  while (diff > PI) diff -= TWO_PI;
  while (diff < -PI) diff += TWO_PI;
  return a + diff * t;
}

// Base klasse
class Fish {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 15;
    this.angle = random(TWO_PI);
    this.wanderTimer = 0;
  }

  // Border-funktion: drej blidt væk fra kanten, hvis du nærmer dig
  border(margin = 50, turnAngle = 0.15) {
    if (this.x < margin) this.angle = lerpAngle(this.angle, 0, turnAngle);
    else if (this.x > width - margin) this.angle = lerpAngle(this.angle, PI, turnAngle);

    if (this.y < margin) this.angle = lerpAngle(this.angle, HALF_PI, turnAngle);
    else if (this.y > height - margin) this.angle = lerpAngle(this.angle, -HALF_PI, turnAngle);
  }

  // Bevægelse når der ikke er mad (hurtigere random svømning)
  randomSwim(baseSpeed = 0.8) {
    this.wanderTimer--;
    if (this.wanderTimer <= 0) {
      this.angle += random(-0.5, 0.5);
      this.wanderTimer = int(random(30, 90));
    }
    this.border();
    this.x += baseSpeed * cos(this.angle);
    this.y += baseSpeed * sin(this.angle);
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    ellipse(0, 0, this.size, this.size / 2);
    triangle(-this.size / 2, 0, -this.size, -5, -this.size, 5);
    pop();
  }
}

// Grøn fisk
class FishTypeA extends Fish {
  constructor(x, y) {
    super(x, y);
    this.color = color(100, 255, 100);
    this.speed = 1.5;
  }

  move(foodList, redFoodList) {
    if (foodList.length > 0) this.seek(foodList, this.speed);
    else this.randomSwim(0.8);
  }

  seek(foodList, speed) {
    let closest = null;
    let minDist = Infinity;

    for (let food of foodList) {
      let d = dist(this.x, this.y, food.x, food.y);
      if (d < minDist) {
        minDist = d;
        closest = food;
      }
    }

    if (closest) {
      let angleToFood = atan2(closest.y - this.y, closest.x - this.x);
      this.angle = lerpAngle(this.angle, angleToFood, 0.2);
      this.x += speed * cos(this.angle);
      this.y += speed * sin(this.angle);

      if (minDist < 10) closest.eaten = true;
      this.x = constrain(this.x, 0, width);
      this.y = constrain(this.y, 0, height);
    }
  }

  show() {
    fill(this.color);
     push();
    translate(this.x, this.y);
    rotate(this.angle);
    ellipse(0, 0, this.size, this.size / 1.5);
    triangle(-this.size / 2, 0, -this.size, -5, -this.size, 5);
    pop();
  }
}

// Gul fisk
class FishTypeB extends Fish {
  constructor(x, y) {
    super(x, y);
    this.color = color(255, 255, 0);
    this.speed = 2.8;
  }

  move(foodList, redFoodList) {
    if (redFoodList.length > 0) this.seek(redFoodList, this.speed);
    else this.randomSwim(1.0);
  }

  seek(redFoodList, speed) {
    let closest = null;
    let minDist = Infinity;

    for (let food of redFoodList) {
      let d = dist(this.x, this.y, food.x, food.y);
      if (d < minDist) {
        minDist = d;
        closest = food;
      }
    }

    if (closest) {
      let angleToFood = atan2(closest.y - this.y, closest.x - this.x);
      this.angle = lerpAngle(this.angle, angleToFood, 0.2);
      this.x += speed * cos(this.angle);
      this.y += speed * sin(this.angle);

      if (minDist < 10) closest.eaten = true;
      this.x = constrain(this.x, 0, width);
      this.y = constrain(this.y, 0, height);
    }
  }

  show() {
    fill(this.color);
    super.show();
  }
}

// Gul rund mad
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

// Rød firkant mad
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
