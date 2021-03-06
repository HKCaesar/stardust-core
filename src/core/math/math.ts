export abstract class MathType {
    public abstract toArray(): number[];
    public abstract clone(): MathType;
}

export class Vector2 extends MathType {
    constructor(
        public x: number = 0,
        public y: number = 0
    ) { super(); }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public add(rhs: Vector2): Vector2 {
        return new Vector2(this.x + rhs.x, this.y + rhs.y);
    }

    public sub(rhs: Vector2): Vector2 {
        return new Vector2(this.x - rhs.x, this.y - rhs.y);
    }

    public mul(rhs: Vector2): Vector2 {
        return new Vector2(this.x * rhs.x, this.y * rhs.y);
    }

    public div(rhs: Vector2): Vector2 {
        return new Vector2(this.x / rhs.x, this.y / rhs.y);
    }

    public scale(rhs: number): Vector2 {
        return new Vector2(this.x * rhs, this.y * rhs);
    }

    public dot(rhs: Vector2): number {
        return this.x * rhs.x + this.y * rhs.y;
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public normalize(): Vector3 {
        let l = Math.sqrt(this.x * this.x + this.y * this.y);
        return new Vector3(this.x / l, this.y / l);
    }

    public toArray(): number[] {
        return [ this.x, this.y ];
    }

    public static FromArray([a, b]: number[]): Vector2 {
        return new Vector2(a, b);
    }
}

export class Vector3 extends MathType {
    constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0
    ) { super(); }

    public clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    public add(rhs: Vector3): Vector3 {
        return new Vector3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
    }

    public sub(rhs: Vector3): Vector3 {
        return new Vector3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
    }

    public mul(rhs: Vector3): Vector3 {
        return new Vector3(this.x * rhs.x, this.y * rhs.y, this.z * rhs.z);
    }

    public div(rhs: Vector3): Vector3 {
        return new Vector3(this.x / rhs.x, this.y / rhs.y, this.z / rhs.z);
    }

    public scale(rhs: number): Vector3 {
        return new Vector3(this.x * rhs, this.y * rhs, this.z * rhs);
    }

    public dot(rhs: Vector3): number {
        return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z;
    }

    public cross(rhs: Vector3): Vector3 {
        return new Vector3(
            this.y * rhs.z - this.z * rhs.y,
            this.z * rhs.x - this.x * rhs.z,
            this.x * rhs.y - this.y * rhs.x
        );
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public normalize(): Vector3 {
        let l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        return new Vector3(this.x / l, this.y / l, this.z / l);
    }

    public toArray(): number[] {
        return [ this.x, this.y, this.z ];
    }

    public static FromArray([a, b, c]: number[]): Vector3 {
        return new Vector3(a, b, c);
    }
}

export class Quaternion extends MathType {
    constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
        public w: number = 0
    ) { super(); }

    public clone(): Quaternion {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }

    public conj(): Quaternion {
        return new Quaternion(-this.x, -this.y, -this.z, this.w);
    }

    public mul(rhs: Quaternion): Quaternion {
        return new Quaternion(
            rhs.x * this.w + this.x * rhs.w + this.y * rhs.z - this.z * rhs.y,
            rhs.y * this.w + this.y * rhs.w + this.z * rhs.x - this.x * rhs.z,
            rhs.z * this.w + this.z * rhs.w + this.x * rhs.y - this.y * rhs.x,
            this.w * rhs.w - this.x * rhs.x - this.y * rhs.y - this.z * rhs.z
        );
    }

    public rotate(vector: Vector3): Vector3 {
        let q = new Quaternion(vector.x, vector.y, vector.z, 0);
        let qv = this.mul(q).mul(this.conj());
        return new Vector3(qv.x, qv.y, qv.z);
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.w * this.w);
    }

    public normalize(): Quaternion {
        let s = Math.sqrt(this.x * this.x + this.y * this.y + this.w * this.w);
        return new Quaternion(this.x / s, this.y / s, this.z / s, this.w / s);
    }

    public slerp(rhs: Quaternion, t: number) {
        return Quaternion.Slerp(this, rhs, t);
    }

    public static Slerp(q1: Quaternion, q2: Quaternion, t: number) {
        let acos_arg = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
        if(acos_arg > 1) acos_arg = 1;
        if(acos_arg < -1) acos_arg = -1;
        let omega = Math.acos(acos_arg);
        let st0: number, st1: number;
        if(Math.abs(omega) < 1e-10) {
            st0 = 1 - t;
            st1 = t;
        } else {
            let som = Math.sin(omega);
            st0 = Math.sin((1 - t) * omega) / som;
            st1 = Math.sin(t * omega) / som;
        }
        return new Quaternion(
            q1.x * st0 + q2.x * st1,
            q1.y * st0 + q2.y * st1,
            q1.z * st0 + q2.z * st1,
            q1.w * st0 + q2.w * st1
        );
    }

    public static Rotation(axis: Vector3, angle: number): Quaternion {
        let axis_normal = axis.normalize().scale(Math.sin(angle / 2));
        return new Quaternion(
            axis_normal.x, axis_normal.y, axis_normal.z,
            Math.cos(angle / 2)
        );
    }

    public toArray(): number[] {
        return [ this.x, this.y, this.z, this.w ];
    }

    public static FromArray([a, b, c, d]: number[]): Quaternion {
        return new Quaternion(a, b, c, d);
    }
}

export class Pose {
    constructor(
        public position: Vector3 = new Vector3(0, 0, 0),
        public rotation: Quaternion = new Quaternion(0, 0, 0, 1)
    ) {}
}