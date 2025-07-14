## VS Code Symbol Tools for Context Efficiency
Use VS Code symbol tools to reduce context consumption:
- `get_document_symbols_code` for file structure overview instead of reading entire files
- `search_symbols_code` to find symbols by name across the project
- `get_symbol_definition_code` for type info and docs without full file context
- Workflow: get outline → search symbols → get definitions → read implementation only when needed