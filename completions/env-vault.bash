# bash completion for env-vault
_env_vault_completions() {
  local cur prev commands opts
  COMPREPLY=()
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"
  commands="encrypt decrypt rotate inspect"
  opts="-k --key --old-key --new-key --dry-run -h --help -v --version"

  if [[ ${COMP_CWORD} -eq 1 ]]; then
    COMPREPLY=( $(compgen -W "${commands} ${opts}" -- "${cur}") )
    return 0
  fi

  if [[ ${cur} == -* ]]; then
    COMPREPLY=( $(compgen -W "${opts}" -- "${cur}") )
    return 0
  fi

  COMPREPLY=( $(compgen -f -- "${cur}") )
}
complete -F _env_vault_completions env-vault
