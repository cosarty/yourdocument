import { history } from '@umijs/max';
import { Button, Card } from 'antd';

const MyPaper = () => {
  return (
    <Card
      title='试卷管理'
      extra={
        <Button
          type='primary'
          onClick={() => {
            history.push('/addPaper');
          }}
        >
          创建试卷
        </Button>
      }
    >
      发的说法是的
    </Card>
  );
};

export default MyPaper;
