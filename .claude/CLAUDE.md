# Buy-Arch Project Configuration

## Project Information
- **Project Identifier**: BA (Buy-Arch)
- **Primary Language**: TypeScript
- **Framework**: Next.js
- **Database**: PostgreSQL with Prisma
- **Task Management**: Huly

## Huly Integration Rules

### Task Completion Requirements
- **ALWAYS** write completion comments in Russian
- **ALWAYS** use estimated time as spent time (estimation = actual)
- **NEVER** skip Huly status updates
- Status flow: Todo → In Progress → Done

## Hard Rules

### Code Quality
1. **NEVER** write code without understanding the full context
2. **ALWAYS** follow TypeScript best practices and type safety
3. **ALWAYS** use the exact file paths specified in the task
4. **NEVER** create files in incorrect locations
5. **ALWAYS** preserve existing functionality when modifying files
6. **ALWAYS** use proper TypeScript types, avoid `any`
7. **ALWAYS** handle errors properly with try-catch
8. **ALWAYS** validate user input
9. **NEVER** leave console.log in production code

### Security
10. **NEVER** hardcode sensitive information (passwords, API keys, secrets)
11. **ALWAYS** use environment variables for configuration
12. **ALWAYS** sanitize user input
13. **ALWAYS** use parameterized queries (Prisma prevents SQL injection)
14. **NEVER** expose internal error details to users

### Dependencies
15. **ONLY** install dependencies listed in the task file
16. **NEVER** add dependencies that are not specified
17. **ALWAYS** use the exact package versions if specified
18. **VERIFY** that all dependencies are compatible

### Docker & Environment
19. **ALWAYS** respect Docker configurations in the task
20. **NEVER** modify Docker files unless specified in the task
21. **ALWAYS** use environment variables as specified
22. **NEVER** hardcode database connection strings

### File Operations
23. **ALWAYS** check if a file exists before creating it
24. **NEVER** overwrite files without explicit instruction
25. **ALWAYS** respect .gitignore rules
26. **ALWAYS** maintain proper file permissions

### Implementation Accuracy
27. **FOLLOW** the exact folder structure specified
28. **IMPLEMENT** all features listed in acceptance criteria
29. **DO NOT** skip steps or take shortcuts
30. **DO NOT** deviate from the specification without asking
31. **COMPLETE** ALL acceptance criteria before marking task done

## Anti-Hallucination Rules

### File and Path Verification
- **BEFORE** referencing any file, VERIFY it exists
- **BEFORE** importing any module, CHECK it's installed
- **BEFORE** using any API, CONFIRM it's available
- **NEVER** assume a file exists - always check first
- **NEVER** guess file paths - use exact paths from task or search for them

### Code References
- **ONLY** reference code that you have READ
- **NEVER** assume implementation details without verification
- **ALWAYS** check existing code before extending it
- **DO NOT** invent function names or APIs
- **DO NOT** assume variable names or types

### Dependencies and Packages
- **VERIFY** package names are correct before installation
- **CHECK** that packages exist in npm registry
- **CONFIRM** version compatibility before installing
- **READ** package documentation when unsure
- **NEVER** invent package names or versions

### Configuration
- **READ** existing configuration files before modifying
- **VERIFY** environment variables are defined
- **CHECK** configuration syntax is valid
- **NEVER** assume default configurations
- **ALWAYS** validate configuration changes

### Database and Schema
- **READ** the Prisma schema before making changes
- **VERIFY** field names and types match specifications
- **CHECK** relationships are correctly defined
- **NEVER** assume database structure without checking
- **ALWAYS** review migration files before applying

## Coding Standards

### TypeScript Best Practices

#### Proper Typing
```typescript
// Good: Proper typing
interface User {
  id: string;
  email: string;
  name: string | null;
}

async function getUser(id: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id } });
}

// Bad: Using any
async function getUser(id: any): Promise<any> {
  return await prisma.user.findUnique({ where: { id } });
}
```

#### Error Handling
```typescript
// Good: Proper error handling
try {
  const user = await prisma.user.create({ data });
  return NextResponse.json({ user }, { status: 201 });
} catch (error) {
  console.error('Failed to create user:', error);
  return NextResponse.json(
    { error: 'Failed to create user' },
    { status: 500 }
  );
}

// Bad: No error handling
const user = await prisma.user.create({ data });
return NextResponse.json({ user }, { status: 201 });
```

### React Components
```typescript
// Good: Proper component structure
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}

// Bad: No types, unclear structure
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### API Routes
```typescript
// Good: Validation and error handling
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = schema.parse(body);

    // Process request
    const result = await processData(validatedData);

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Project-Specific Rules

### Database
- Use Prisma for all database operations
- Never write raw SQL queries
- Always use transactions for multi-step operations
- Follow the existing schema patterns

### Authentication
- Use NextAuth for authentication
- Never store passwords in plain text
- Always validate sessions on API routes
- Use middleware for route protection

### API Design
- RESTful conventions
- Proper HTTP status codes
- Consistent error response format
- Input validation on all endpoints

### File Structure
- Follow Next.js App Router conventions
- Components in `src/components/`
- API routes in `src/app/api/`
- Server actions in `src/actions/`
- Types in `src/types/`

## Important Reminders

1. **READ FIRST, CODE SECOND** - Always read and understand before implementing
2. **VERIFY EVERYTHING** - Never assume, always check
3. **FOLLOW THE SPEC** - Implement exactly what is requested
4. **ASK WHEN UNCLEAR** - Better to clarify than to implement incorrectly
5. **COMPLETE ALL CRITERIA** - Don't skip acceptance criteria
6. **DOCUMENT YOUR WORK** - Leave clear comments and documentation
7. **RESPECT THE STRUCTURE** - Follow project conventions and patterns
8. **RUSSIAN SUMMARIES** - Always write completion comments in Russian
