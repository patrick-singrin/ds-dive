# System Documentation

This directory contains technical architecture, troubleshooting, and system-level documentation.

## ⚙️ **Available Documentation**

### **Architecture & Decisions**
- **[architecture-decisions.md](./architecture-decisions.md)** - ADRs documenting WHY we made technical choices
- **[enterprise-setup.md](./enterprise-setup.md)** - Enterprise environment configuration

### **Troubleshooting & Prevention**
- **[troubleshooting-guide.md](./troubleshooting-guide.md)** - Known issues and solutions
- **[PREVENTION_SYSTEM.md](./PREVENTION_SYSTEM.md)** - System for preventing repeated issues

## 🚨 **Common Issues Quick Reference**

### **Component Registration Problems**
- **Issue**: Components not showing in Storybook
- **Solution**: Check centralized imports in `.storybook/setup.ts`

### **Icon Display Issues**
- **Issue**: Icons not rendering in Shadow DOM
- **Solution**: Use inline SVG with path definitions (not external sprites)

### **Design Token Access**
- **Issue**: CSS variables not available in components
- **Solution**: Ensure `:host` level token inheritance

## 🔧 **System Architecture**

Our design system follows these key architectural decisions:
- **Web Components** with LitElement for framework independence
- **Shadow DOM** for true style encapsulation
- **Design Tokens** as single source of truth (1004 CSS variables)
- **TypeScript** for type safety and developer experience

## 🔗 **Related Documentation**

- **AI-Assisted Development**: [`../knowledge-graph/`](../knowledge-graph/) - Context-aware development
- **Development Guides**: [`../guides/`](../guides/) - Practical workflows
- **Project Info**: [`../project/`](../project/) - Implementation summaries 