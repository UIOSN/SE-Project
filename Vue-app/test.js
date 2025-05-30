describe('志愿表完整流程测试', () => {
    it('应完成院校添加->调整->提交全流程', () => {
      // 1. 访问首页
      cy.visit('/');
      
      // 2. 搜索院校
      cy.get('.search-input').type('清华');
      cy.contains('清华大学').should('be.visible');
      
      // 3. 添加到志愿表
      cy.get('.college-card:first-child .add-button').click();
      cy.get('.wishlist-tab').should('contain', '1所院校');
      
      // 4. 提交验证
      cy.get('.submit-button').click();
      cy.on('window:alert', (text) => {
        expect(text).to.contains('提交成功');
      });
    });
  });