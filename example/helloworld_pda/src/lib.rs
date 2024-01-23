use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    program::{invoke_signed},
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct MyAccountData {
    // 定义你的数据结构
    pub data: u32,
}

// 程序的入口点
entrypoint!(process_instruction);

// 实际处理指令的函数
pub fn process_instruction(
    program_id: &Pubkey, // 当前程序的公钥
    accounts: &[AccountInfo], // 传递给程序的账户数组
    _instruction_data: &[u8], // 调用程序时传递的数据
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let initializer_account = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // 设置 PDA 的种子和Bump，这些应该是事先知道的
    let (pda, bump_seed) = Pubkey::find_program_address(&[b"my_seed"], program_id);

    if pda != *pda_account.key {
        return Err(ProgramError::InvalidArgument);
    }

    let account_lamports = 1; // 需要为PDA账户提供的lamports数量
    let account_space = 8 + MyAccountData::default().try_to_vec()?.len() as u64; // 计算你的账户需要多少空间
    let account_owner = program_id; // PDA的所有者将是当前程序

    // 创建账户的指令
    let create_pda_account = system_instruction::create_account(
        initializer_account.key,
        pda_account.key,
        account_lamports,
        account_space,
        account_owner,
    );

    // 使用invoke_signed调用上面创建的指令，以允许程序创建PDA
    invoke_signed(
        &create_pda_account,
        &[initializer_account.clone(), pda_account.clone(), system_program.clone()],
        &[&[b"my_seed", &[bump_seed]]],
    )?;

    Ok(())
}

impl Default for MyAccountData {
    fn default() -> Self {
        Self { data: 0 }
    }
}
