class Box{
  constructor(o){
    this.m=o.m || 1;
    this.F = o.F || {lfF:0,tpF:0};
    this.g = o.g || 10;
    this.v0 = o.v0 || {lfV0:0,tpV0:0};
    this.dir = o.dir || [0,0];
    this.H = o.H || 1;
    this.W = o.W || 1;
    this.time  = 0;
  }
  move(callback){
    this.timer = setInterval(function(){
        this.initF();
        this.getA();
        /*this.dir[0] = this.strDir[0] + (this.v0.lfV0 * this.time + (1/2)*this.a.lfA*this.time**2)/100;
        this.dir[1] = this.strDir[1] + (this.v0.tpV0 * this.time + (1/2)*this.a.tpA*this.time**2)/100;*/
        this.getV();
        this.dir[0] += this.v.lfV / 100;
        this.dir[1] += this.v.tpV / 100;
        this.time+=0.01;
        callback && callback(this,time);
        this.reRender();
    }.bind(this),10);
    return this;
  }
  stopMove(){
    clearInterval(this.timer);
    let v = this.getV();
    this.v0 = {
      lfV0:v.lfV,
      tpV0:v.tpV
    };
    this.time = 0;
    this.initF();
    return this;
  }
  initF(){
    //G
    this.G = this.m*this.g;
    //Fn
    if(this.dir[1] <= 0){
      this.Fn = (this.G - this.F.tpF > 0)?(this.G - this.F.tpF):0;
      if(this.v && this.v0){
        this.v = {lfV:this.v.lfV,tpV:0};
        this.v0 = {lfV0:this.v0.lfV0,tpV0:0};
        this.dir = [this.dir[0],0];
        this.a = {lfA:this.a.lfA,tpA:0};
      }
    }else{
      this.Fn = 0;
    }
    return this;
  }
  getA(){
    this.initF();
    this.a = {
      lfA:this.F.lfF / this.m,
      tpA:(this.F.tpF+this.Fn-this.G) / this.m
    }
    return this.a;
  }
  getV(){
    this.v = {
      lfV:this.v0.lfV0 + this.a.lfA * this.time,
      tpV:this.v0.tpV0 + this.a.tpA * this.time
    };
    return this.v;
  }
  add(o,t){
    this.getA();
    this.stopMove();
    this.addV0(o);
    this.addF(o,t);
    this.addM(o.m);
    this.addHW(o.H,o.W)
    this.getA();
    this.move();
    return this;
  }
  addV0(v0){
    this.v0.tfV0 += o.lfV0;
    this.v0.tpV0 += o.tpV0;
    return this;
  }
  addF(F,time){
    this.getA();
    this.stopMove();
    this.F.lfF += (F.lfF || 0);
    this.F.tpF += (F.tpF || 0);
    if(time){
      setTimeout(function(){
        this.F.lfF -= (F.lfF || 0);
        this.F.tpF -= (F.tpF || 0);
        this.stopMove();
        this.move();
      }.bind(this),time*1000);
    }
    this.move();
    this.getA();
    return this;
  }
  addM(m){
    this.stopMove();
    this.m+=m;
    this.getA();
    return this;
  }
  addHW(h,w){
    this.H += h;
    this.W += w
    return this;
  }
  render(map,o){
    let d = document.createElement('div');
    d.id = o.id || "";
    this.class = o.class || "";
    d.className = "box " + this.class;
    d.style.cssText = o.css || "";
    d.style.height = this.H*100 + 'px';
    d.style.width = this.W*100 + 'px';
    d.style.top = map.offsetHeight - this.dir[1]*100 + 'px';
    d.style.left = this.dir[0]*100 + 'px';
    map.appendChild(d);
    this.ele = d;
    this.map = map;
    return this;
  }
  reRender(){
    let d = this.ele;
    d.style.height = this.H*100 + 'px';
    d.style.width = this.W*100 + 'px';
    d.style.top = this.map.offsetHeight - this.dir[1]*100 + 'px';
    d.style.left = this.dir[0]*100 + 'px';
    return d;
  }
}
let a = new Box({});
a.render(document.body,{css:"background-color:red;"});