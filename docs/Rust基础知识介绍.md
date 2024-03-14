# Rust基础知识介绍.md

### HelloWorld演示

```
创建工程
cargo new --bin helloworld

编译工程
cargo build（编译普通的Rust工程）

运行工程
./target/debug/helloworld
```

### Rust基本语法

#### ⭐基本数据类型

基本数据类型主要有整形、浮点、布尔以及字符类型。
- 整形按照所占空间大小被分为1、2、4、8、16 字节大小的整数。每个大小又有有符号和无符号的差别。 具体的定义如下：

|Length|Signed|Unsigned|
|-------|-------|-------|
|8-bit|i8|u8|
|16-bit|i16|u16|
|32-bit|i32|u32|
|64-bit|i64|u64|
|128-bit|i128|u128|
|arch|isize|usize|

- 而浮点型包括f32和f64两个分别使用4字节和8字节的IEEE-754 浮点格式的浮点数。

- 布尔类型和其他语言的布尔类型类似，用true和false来表示。

- 字符类型是用''单引号括起来的字符。rust天生支持utf-8,所以任何单引号括起来的utf-8字符都是合法的字符类型变量。

#### ⭐复合类型

- 元组（每个元素的类型可以不同）
```rust
let tup: (i32, f64, u8) = (500, 6.4, 1);

访问方式：tup.0
```

- 数组（每个元素的类型必须相同）
```rust
let arr = [1, 2, 3, 4, 5];

访问方式：arr[0]
```

- 结构体（多个类型组合）
```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

let user = User {
    email: String::from("someone@example.com"),
    username: String::from("someusername123"),
    active: true,
    sign_in_count: 1,
};

访问方式：user.email
```

#### ⭐变量

- 变量类型
```rust
不指定类型：  let x = 5;
显示指定类型：let x:u32 = 5;
```

- 可变变量
```rust
let x = 5;
//x = 6; 此步将报错，变量默认不可修改
let x = 6;   //可重新定义变量的值
let x = "a"; //可重新定义变量类型，变量遮蔽（shadowing）

let mut y = 5; //定义可变变量
y = 6
//y = "a"; 此步将报错，可变变量重新赋值不能变更类型
```

#### ⭐let表达式
```rust
定义变量：let condition = true;
条件组合：let number = if condition { 5 } else { "six" };
```

#### ⭐match表达式
```rust
let config_max = Some(3u8);
match config_max {
    Some(max) => println!("The maximum is configured to be {}", max),
    _ => (),    //_表示其他情况，什么也不做
    None => (), //None表示参数为空，什么也不做
}
```

#### ⭐条件语句
```rust
let number = 3;

if number < 5 {
    println!("only if");
}

if number < 5 {
    println!("if else: condition was true");
} else {
    println!("if else: condition was false");
}

if number < 5 {
    println!("if else if : number < 5 ");
} else if number == 5 { 
    println!("if else if : number == 5 ");
} else {
    println!("if else if : number > 5 ");
}
```

#### ⭐循环语句
```rust

loop {
    ...
    break
    ...
}

while true {
    ...
    break
    ...
}

// 类似 int i=1; i<4; i++
for number in (1..4) {
    ...
}
// 类似 int i=3; i>0; i--
for number in (1..4).rev() { //rev()迭代器反转
    ...
}
```

#### ⭐函数
函数分为main函数和普通函数。main函数是可执行程序的入口函数。库不需要main函数。
```rust
fn main() {
    let x = plus_one(5);

    println!("The value of x is: {x}");
}

fn plus_one(x: i32) -> i32 {
    x + 1
}
```

#### ⭐结构体
```rust
定义结构体：
struct User {
    username: String,
    email: String,
}

初始化结构体：
let user1 = User {
    email: String::from("someone@example.com"),
    username: String::from("someusername123"),
};

初始化结构体时使用其他结构体：
let user2 = User {
    email: String::from("another@example.com"),
    ..user1
};

元组结构体：
struct Color(i32, i32, i32);
fn main() {
    let black = Color(1, 2, 3);
    println!("black 0:{}", black.0) //输出：black 0:1
}

特殊结构体：
struct AlwaysEqual;
fn main() {
    let subject = AlwaysEqual;
}
他的值可以是{},所以在代码中看到{}就可以认为是一个不占空间的struct的值，比如:Ok({})
```

#### ⭐枚举
```rust
普通枚举定义：
enum IpAddrKind {
    V4,
    V6,
}
let four = IpAddrKind::V4;

指定类型的枚举定义：
enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}
let home = IpAddr::V4(127, 0, 0, 1);
let home = IpAddr::V6(String::from("127.0.0.1"));

特殊枚举定义：
enum Message {
    Move { x: i32, y: i32 }, //枚举的一个变体
}
let msg = Message::Move { x: 10, y: 20 };
match msg {
    Message::Move { x, y } => {
        println!("Move to position x: {}, y: {}", x, y);
    },
}

```

#### ⭐结构体/枚举方法

结构体/枚举方法：impl xxx {}。

```rust
结构体方法
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle { //结构体方法
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area()
    );
}

枚举方法
enum Message {
    Write(String),
}
impl Message {
    fn call(&self) {
        match self { //类型匹配
            Message::Write(text) => println!("{}", text), //枚举解包
        }
    }
}
fn main() {
    let m = Message::Write(String::from("hello"));
    m.call();
}
```

#### ⭐容器-list/vector
```rust
Vec<T>
vec是std提供的链表类型。可以用来存放相同类型的数组。

创建指定类型的vector：
let v: Vec<i32> = Vec::new();

通过vec!宏直接赋值初始化：
let v = vec![1, 2, 3];

增加元素：
let mut v = Vec::new();
v.push(5);
v.remove(5)

获取元素：
fn main() {
    let v = vec![1, 2, 3, 4, 5];
    
    let third: &i32 = &v[2];
    println!("The third element is {third}");
    
    let third: Option<&i32> = v.get(2);
    match third {
        Some(third) => println!("The third element is {third}"),
        None => println!("There is no third element."),
    }
}

迭代器遍历（只读）：
let v = vec![100, 32, 57];
for n_ref in &v {
    // n_ref has type &i32
    let n_plus_one: i32 = *n_ref + 1;
    println!("{n_plus_one}");
}
迭代器遍历（可写）：
let mut v = vec![100, 32, 57];
for n_ref in &mut v {
    // n_ref has type &mut i32
    *n_ref += 50;
}

//&：引用
//*：解引用
```

#### ⭐String
rust的String不是基础类型，是由std提供的类型。
```rust
创建字符串：
let mut s = String::new();
let data = "initial contents";
let s = data.to_string();
let s = String::from("initial contents");

修改字符串：
//方法1：push_str
let mut s = String::from("foo");
s.push_str("bar"); 

let mut s1 = String::from("foo");
let s2 = "bar";
s1.push_str(s2);
println!("s2 is {s2}");

//方法2：push
let mut s = String::from("lo");
s.push('l');

//方法3：+ （注意"+"会borrow变量）
let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2; // note s1 has been moved here and can no longer be used

读字符串：
let s1 = String::from("hello");
let h = s1[0];
```

#### ⭐Map
rust中的map也不是基础类型，而是std提供的，类似于HashMap。
```rust
//创建MAP：
use std::collections::HashMap;
let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);
println!("创建MAP：{:?}", scores);

//访问MAP：
let team_name = String::from("Blue");
let score = scores.get(&team_name).copied().unwrap_or(0);
println!("访问MAP：Blue={}", score);

//遍历MAP：
println!("遍历MAP：");
for (key, value) in &scores {
    println!("{key}: {value}");
}

//插入修改：
scores.insert(String::from("Blue"), 25);
println!("插入修改：{:?}", scores);

//判断是否存在，不存在才插入：
let mut scores = HashMap::new();
scores.insert(String::from("Red"), 10);

scores.entry(String::from("Red")).or_insert(50);
scores.entry(String::from("Green")).or_insert(50);

println!("判断不存在才插入：{:?}", scores);
```

#### ⭐trait
trait 类似其他语言中的接口。
```rust
//定义接口
pub trait Summary {
    fn summarize(&self) -> String;
}

//实现接口
pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}

//如果在定义时给出默认实现，如果没有impl方法实现，则使用默认实现。
pub trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}

//接口可以作为参数传递
pub fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}

//接口还可以作为返回值
fn returns_summarizable() -> impl Summary {
    Tweet {
        username: String::from("horse_ebooks"),
        content: String::from(
            "of course, as you probably already know, people",
        ),
        reply: false,
        retweet: false,
    }
}

```

#### ⭐泛型

函数中使用泛型。
```rust
fn largest<T:std::cmp::PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}

fn main() {
    let number_list = vec![34, 50, 25, 100, 65];

    let result = largest(&number_list);
    println!("The largest number is {}", result);

    let char_list = vec!['y', 'm', 'a', 'q'];

    let result = largest(&char_list);
    println!("The largest char is {}", result);
}
```

在结构体中使用泛型。
```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
    fn y(&self) -> &T {
        &self.y
    }
}

fn main() {
    let p = Point { x: 5, y: 10 };

    println!("p.x = {}", p.x());
    println!("p.y = {}", p.y());
}
```


在枚举中使用泛型。
```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

#### ⭐
```rust
```

#### ⭐
```rust
```