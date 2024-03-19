# Anchor框架开发入门

### 普通程序示例（合约）

Playground计数器代码，详见：example\HelloAnchor_pg

```rust
// use this import to gain access to common anchor features
use anchor_lang::prelude::*;

// declare an id for your program
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

// write your business logic here
// pub fn initialize_counter：  initialize_counter为账户验证的结构体名称，全小写_全小写
// Context<InitializeCounter>: InitializeCounter为账户验证的结构体名称
// Data: Data为账户结构体名
#[program]
mod hello_world {
    use super::*;
    pub fn say_hello(ctx: Context<SayHello>) -> Result<()> {
        msg!("Hello World!");

        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        msg!("Hello World! - Greeting # {}", counter.count);

        Ok(())
    }

    pub fn initialize_counter(ctx: Context<InitializeCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        msg!("Initialized new count. Current value: {}!", counter.count);
        Ok(())
    }
}

// validate incoming accounts here
#[derive(Accounts)]
pub struct SayHello<'info> {
    #[account(mut)]//通过#[account(mut)]属性，指定counter字段为可变的Account类型，用来存储和修改Counter结构体的实例。
    pub counter: Account<'info, Counter>,
}

#[derive(Accounts)]
pub struct InitializeCounter<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub signer: Signer<'info>, //创建账户才需要签名
    pub system_program: Program<'info, System>, //系统程序用于创建账户
}

#[account]
pub struct Counter {
    count: u64,
}


```

账户验证结构中可使用的账户类型:
```rust
anchor_lang::accounts

- account: 一个在反序列化时检查所有权的账户容器。
- account_info: AccountInfo可以作为一种类型使用，但是建议使用Unchecked Account来代替。
- account_loader: 一种便利类型，用于按需零拷贝反序列化。
- boxed: 用于节省栈空间的Box类型。
- interface: 验证账户是给定一组程序中的一个的类型。
- interface_account: 一个在反序列化时检查所有权的账户容器。
- option: 用于可选账户的Option类型。
- program: 验证账户是给定程序的类型。
- signer: 验证账户已签署交易的类型。
- system_account: 验证账户由系统程序拥有的类型。
- sysvar: 验证账户是sysvar并对其进行反序列化的类型。
- unchecked_account: AccountInfo类型的显式包装器，用以强调不进行检查。
```
```rust
#[derive(Accounts)]：
这个宏用来定义一个结构体，该结构体表示智能合约函数需要访问的账户（account）集合。在Anchor中，每个方法通常都有一个对应的上下文（context）结构体，这个结构体通过#[derive(Accounts)]来指定需要哪些账户以及它们的访问权限等。例如，在SayHello和InitializeCounter这两个结构体中，我们分别定义了say_hello和initialize_counter函数所需的账户。

#[account(init, payer = signer, space = 8 + 8)]
这个宏用于初始化一个新的账户。init参数表示这个账户将被创建并初始化。payer = signer说明创建账户的费用由签名者（即函数的调用者）支付。space = 8 + 8指定为这个新账户分配多少字节的存储空间；这里指定了16字节，其中8字节用于存储Solana账户的元数据，另外8字节用于存储自定义的数据（在这个例子中是count字段）。在InitializeCounter结构体中，counter账户就是通过这种方式被初始化的。

#[account(mut)]
这个宏用于标注一个账户需要被修改。在Solana中，当你想要更改账户的数据时，你需要显式地声明这个账户是可变的（mutable）。在SayHello结构体中，counter账户被标注为可变的，这意味着say_hello函数将增加计数器的值。

#[account]
这个宏用于简单地标注一个结构体作为一个Solana账户。在这个例子中，Counter结构体通过#[account]宏被标记，表明它是一个账户，其数据是存储在链上的，而这个账户具体存储了一个名为count的u64类型的计数器。
```

![alt text](image.png)

### 普通程序交互

在Playground上操作。
```shell
Building...
Build successful. Completed in 2.56s.

Deploying... This could take a while depending on the program size and network conditions.
Deployment successful. Completed in 21s.
```

执行client-init.ts脚本，初始化计数器。
```shell
Running client...
  client-init.ts:
    creating counter:  6q1LQaK5HA1aZbYJhBW3qswjkyq6NanqwZhQUdh41fAb
    https://explorer.solana.com/tx/qzBddf8zmjb7rh8Le9jZiYkizLVzxn5ncQk5tD1T1cjVj4iSJMJDuFxG34XSDvNvNvvxG1yHxJr861BU9avY6mF?cluster=devnet
```

修改client-count.ts脚本:
```shell
const COUNTER = "6q1LQaK5HA1aZbYJhBW3qswjkyq6NanqwZhQUdh41fAb"; //Replace with your public key
```

执行client-count.ts脚本，执行计数器累加。
```shell
Running client...
  client-count.ts:
    G8L9EWdphFMdp6618tFfhuUfvP5x1BPZ25UW3wfwhi9e saying hello:
    https://explorer.solana.com/tx/26vsCqr6otRE4XbfAf1EAkvtEv38eHJ1Ewb9YPp9AGP3qgjZwqt5UiCtCaZCmUXpYYqAqNC1w8Hky2d6jL7sKs3V?cluster=devnet
    greeted 1  times

Running client...
  client-count.ts:
    G8L9EWdphFMdp6618tFfhuUfvP5x1BPZ25UW3wfwhi9e saying hello:
    https://explorer.solana.com/tx/2gACNEWeB6uHcpSTD9mTMEJiyz6ognTj6JJY3nQvR2dcyfTszHvhcEM6JxMqLHNEbJ7RotBLbjPPnMLzC6p2364e?cluster=devnet
    greeted 2  times
```

### PDA程序示例

Playground餐厅代码，详见：example\AnchorPDA_pg

```rust
use anchor_lang::prelude::*;

declare_id!("9pth18NfpmAZuWr2yGk8yp1ShZjYRKgQZU4wTgDHmxoy");

#[program]
mod restaurant_review {
    use super::*;
    pub fn post_review(
        ctx: Context<ReviewAccounts>,
        restaurant: String,
        review: String,
        rating: u8,
    ) -> Result<()> {
        let new_review = &mut ctx.accounts.review;
        new_review.reviewer = ctx.accounts.signer.key();
        new_review.restaurant = restaurant;
        new_review.review = review;
        new_review.rating = rating;
        msg!(
            "Restaurant review for {} - {} stars",
            new_review.restaurant,
            new_review.rating
        );
        msg!("Review: {}", new_review.review);

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(restaurant: String)]
pub struct ReviewAccounts<'info> {
    #[account(
        init_if_needed,
        payer = signer,
        space = 500,
        seeds = [restaurant.as_bytes().as_ref(), signer.key().as_ref()],
        bump
        
    )]
    pub review: Account<'info, Review>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Review {
    pub reviewer: Pubkey,
    pub restaurant: String,
    pub review: String,
    pub rating: u8,
}

```

```rust
#[instruction(...)] 属性宏用于定义与智能合约的某个特定指令相关的额外参数。这些参数在智能合约函数被调用时将作为输入一并传递。

#[instruction(restaurant: String)] 表明在调用对应的智能合约函数时，需要传递一个名为 restaurant 的字符串参数。个人理解为声明一个 restaurant 参数，供下面使用。

init_if_needed：如果帐户不存在，则创建帐户。

seeds 和 bump：将检查传递的帐户是否是从当前执行的程序、seed 和 bump 派生的PDA账户。
```

### PDA账户交互
```shell
Building...
Build successful. Completed in 4.14s.

Deploying... This could take a while depending on the program size and network conditions.
Deployment successful. Completed in 19s.

Running client...
  client.ts:
    Reviewer: G8L9EWdphFMdp6618tFfhuUfvP5x1BPZ25UW3wfwhi9e
    Review PDA: 2eftssa9NJniuexyb5dGYc2YPSjvVb3nhCTFf2poDSZ5
    https://explorer.solana.com/tx/2e7RZ7tDFG3gfg1r1i2xxW5JieXW5eDLrrBhuhoXJdAd5jmgRwjuUCriMBccptsfjjjipimrvQSHCH7Z26CrY2dm?cluster=devnet
    Reviewer:  G8L9EWdphFMdp6618tFfhuUfvP5x1BPZ25UW3wfwhi9e
    Restaurant:  Quick Eats
    Review:  Always super fast!
    Rating:  5
```

### Anchor账户约束
